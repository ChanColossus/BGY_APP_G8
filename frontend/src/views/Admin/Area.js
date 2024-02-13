import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getToken } from "../../utils/helpers";
import Select from 'react-select';
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Carousel } from 'react-bootstrap';

function Area() {
  const [tableData, setTableData] = useState({});
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDisasters, setSelectedDisasters] = useState([]);
  const [newAreaData, setNewAreaData] = useState({
    name: "",
    description: "",
    images: [],
    disasterProne: []
  });
  const [disasters, setDisasters] = useState([]);
  const [dataRefresh, setDataRefresh] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data again
        const areaResponse = await fetch("http://localhost:4001/api/v1/area");
        if (!areaResponse.ok) {
          throw new Error(`HTTP error! Status: ${areaResponse.status}`);
        }
        const areaData = await areaResponse.json();
        setTableData(areaData.area);


        // Reset the data refresh state
        setDataRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    if (dataRefresh) {
      fetchData();
    }
  }, [dataRefresh]);
  console.log(tableData)
  console.log(tableData.area)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1, // Make sure it is spelled correctly
    fade: true,
  };
  if (error) {
    return (
      <div className="content">
        <p>Error loading data. Please check your network connection and try again.</p>
      </div>
    );
  }
  if (typeof tableData !== "object" || tableData === null) {
    console.error("tableData is not an object:", tableData);
    return (
      <div className="content">
        <p>Loading...</p>
      </div>
    );
  }
  const dataEntries = Object.entries(tableData);

  //CREATE FUNCTIONS
  const openModal = async () => {
    try {
      const disastersResponse = await axios.get("http://localhost:4001/api/v1/disasters");
      setDisasters(disastersResponse.data.disasters); // Assuming the response data has a key named 'disasters'
      setModalOpen(true);
      setNewAreaData({
        bname: "",
        bdescription: "",
        bimages: [],
        disasterProne: [],
      });
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleImageChangeCreate = (e) => {
    const files = Array.from(e.target.files);
    setNewAreaData({
      ...newAreaData,
      bimages: files,
      imagePreviews: files.map((file) => URL.createObjectURL(file)),
    });
  };
  const handleFormSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      console.log(getToken())
      const formData = new FormData();
      formData.append("bname", newAreaData.bname);
      formData.append("bdescription", newAreaData.bdescription);


      newAreaData.disasterProne.forEach((disaster) => {
        formData.append("disasterNames", disaster);
      });

      newAreaData.bimages.forEach((image) => {
        formData.append("bimages", image);
      });
      console.log(newAreaData.disasterProne)
      console.log(newAreaData)
      const response = await axios.post("http://localhost:4001/api/v1/admin/area/new", formData, config);
      setSelectedDisasters([]);
      setDataRefresh(true);

      console.log(response.data);

      closeModal();
    } catch (error) {

      console.error("Error submitting form:", error);
    }
  };
  //DELETE FUNCTION
  const handleDeleteClick = async (row) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      // Send a DELETE request to the backend API
      const response = await axios.delete(`http://localhost:4001/api/v1/admin/disaster/${row._id}`, config);

      // Check if the deletion was successful
      if (response.data.success) {
        // Remove the deleted disaster from the state or refresh the data
        setDataRefresh(true); // Assuming you have a state variable to trigger data refresh

        // Log success message
        console.log(response.data.message);
      } else {
        // Handle failure scenario
        console.error("Failed to delete disaster:", response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting disaster:", error);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedDisasters = selectedOptions.map(option => option.value);

    // Update newAreaData with selected disasters
    setNewAreaData({
      ...newAreaData,
      disasterProne: selectedDisasters,
    });

    // Update selectedDisasters state
    setSelectedDisasters(selectedDisasters);
  };
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">
                  Area List{" "}
                  <Button color="primary" className="float-right" onClick={openModal}>
                    New area
                  </Button>
                </CardTitle>
                <p className="card-category">
                  Taguig is a landlocked highly urbanized city in the National Capital Region. The city has a land area of 45.21 square kilometers or 17.46 square miles. Its population as determined by the 2020 Census was 886,722.
                </p>
              </CardHeader>
              <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
                <ModalHeader toggle={closeModal}>New Disaster</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="bname">Name</Label>
                      <Input
                        type="text"
                        id="bname"
                        value={newAreaData.name}
                        onChange={(e) =>
                          setNewAreaData({ ...newAreaData, bname: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="bdescription">Description</Label>
                      <Input
                        type="textarea"
                        id="bdescription"
                        value={newAreaData.description}
                        onChange={(e) =>
                          setNewAreaData({
                            ...newAreaData,
                            bdescription: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="images">Images</Label>
                      <Input
                        type="file"
                        id="images"
                        multiple
                        onChange={handleImageChangeCreate}
                        accept="image/*"
                      />
                      {newAreaData.imagePreviews &&
                        newAreaData.imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Image ${index + 1}`}
                            style={{ width: "100px", height: "auto", marginRight: "10px" }}
                          />
                        ))}
                    </FormGroup>
                    <Select
                      options={Array.isArray(disasters) ? disasters.map(disaster => ({ value: disaster.name, label: disaster.name })) : []}
                      value={selectedDisasters.map(disaster => ({ value: disaster, label: disaster }))}
                      onChange={handleSelectChange}
                      isMulti
                    />
                    <Button color="primary" onClick={handleFormSubmit}>
                      Submit
                    </Button>
                  </Form>
                </ModalBody>
              </Modal>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Images</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Disasters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataEntries.map(([key, row], index) => (
                      <tr key={index}>
                        <td>
                          <Carousel {...settings}>
                            {row.bimages.map((image, imageIndex) => (
                              <Carousel.Item key={imageIndex}>
                                <img
                                  className="d-block w-100"
                                  src={image.url}
                                  alt={`${row.name}-${imageIndex}`}
                                  style={{ width: '100%', height: '80px' }}
                                />
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        </td>
                        <td>{row.bname}</td>
                        <td style={{ width: '400px', }}>{row.bdescription}</td>
                        <td>
                          {row.disasterProne.map((disaster, index) => (
                            <React.Fragment key={`disaster-${index}`}>
                              <div style={{ width: '200px', whiteSpace: 'pre-line' }}>
                                {disaster.name}{index !== row.disasterProne.length - 1 ? ',' : ''}
                              </div>
                            </React.Fragment>
                          ))}
                        </td>
                        <td>
                          <Button
                            color="info"
                            onClick={() => "handleUpdateClick(row)"}
                          >
                            Update
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            onClick={() => handleDeleteClick(row)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Area;
