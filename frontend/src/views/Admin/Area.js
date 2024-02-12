import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getToken } from "../../utils/helpers";
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
  const [newDisasterData, setNewDisasterData] = useState({
    name: "",
    description: "",
    images: [],
  });
  const [dataRefresh, setDataRefresh] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    if (dataRefresh) {
      // Fetch data again
      fetch("http://localhost:4001/api/v1/area")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setTableData(data.area))
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
        });

      // Reset the data refresh state
      setDataRefresh(false);
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
  const openModal = () => {
    setModalOpen(true);
    setNewDisasterData({
      name: "",
      description: "",
      images: [],

    });
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleImageChangeCreate = (e) => {
    const files = Array.from(e.target.files);
    setNewDisasterData({
      ...newDisasterData,
      images: files,
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
      formData.append("name", newDisasterData.name);
      formData.append("description", newDisasterData.description);

      newDisasterData.images.forEach((image) => {
        formData.append("images", image);
      });
      const response = await axios.post("http://localhost:4001/api/v1/admin/disaster/new", formData, config);
      setDataRefresh(true);

      console.log(response.data);

      closeModal();
    } catch (error) {

      console.error("Error submitting form:", error);
    }
  };

  //UPDATE FUNCTIONS
  const openUpdateModal = async (row) => {
    console.log(row._id)
    try {
      if (!row || !row._id) {
        console.error("Invalid row or row id:", row);
        return;
      }
      console.log("Fetching old data for ID:", row._id);
      const apiUrl = `http://localhost:4001/api/v1/disasters/${row._id}`;
      console.log("API URL:", apiUrl);
      const response = await axios.get(apiUrl);
      const oldData = response.data.disaster;
      setNewDisasterData({
        name: oldData.name,
        description: oldData.description,
        images: oldData.images,
      });
      setUpdateId(row._id);
      setUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching old data:", error);
    }
  };
  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setUpdateId(null);
  };
  const handleUpdateClick = (row) => {
    openUpdateModal(row);
  };
  const handleUpdateSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const formData = new FormData();
      formData.append("name", newDisasterData.name);
      formData.append("description", newDisasterData.description);

      if (Array.isArray(newDisasterData.images)) {
        newDisasterData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          } else if (typeof image === 'string') {
            formData.append(`images[${index}]`, image);
          }
        });
      }
      console.log(formData);
      const response = await axios.put(
        `http://localhost:4001/api/v1/admin/disaster/${updateId}`,
        formData, config
      );
      console.log(response.data);
      closeUpdateModal();
      setDataRefresh(true);
    } catch (error) {
      console.error("Error submitting update:", error);
    }
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = [];

    const readAndPreview = (file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        imagePreviews.push(event.target.result);
        setNewDisasterData({
          ...newDisasterData,
          images: imagePreviews,
        });
      };

      reader.readAsDataURL(file);
    };

    files.forEach(readAndPreview);
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
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">Area List  <Button color="primary" className="float-right" onClick={openModal}>
                  New area
                </Button></CardTitle>
                <p className="card-category">
                  Taguig is a landlocked highly urbanized city in the National Capital Region. 
                  The city has a land area of 45.21 square kilometers or 17.46 square miles. 
                  Its population as determined by the 2020 Census was 886,722. 
                 
                </p>
              </CardHeader>
              <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
                <ModalHeader toggle={closeModal}>New Disaster</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        value={newDisasterData.name}
                        onChange={(e) =>
                          setNewDisasterData({ ...newDisasterData, name: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        type="textarea"
                        id="description"
                        value={newDisasterData.description}
                        onChange={(e) =>
                          setNewDisasterData({
                            ...newDisasterData,
                            description: e.target.value,
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
                      {newDisasterData.imagePreviews &&
                        newDisasterData.imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Image ${index + 1}`}
                            style={{ width: "100px", height: "auto", marginRight: "10px" }}
                          />
                        ))}

                    </FormGroup>
                    <Button color="primary" onClick={handleFormSubmit}>
                      Submit
                    </Button>
                  </Form>
                </ModalBody>
              </Modal>
              <Modal isOpen={updateModalOpen} toggle={closeUpdateModal} className="modal-lg">
                <ModalHeader toggle={closeUpdateModal}>Update Disaster</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        value={newDisasterData.name}
                        onChange={(e) =>
                          setNewDisasterData({ ...newDisasterData, name: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        type="textarea"
                        id="description"
                        value={newDisasterData.description}
                        onChange={(e) =>
                          setNewDisasterData({
                            ...newDisasterData,
                            description: e.target.value,
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
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      {
                        newDisasterData.images && newDisasterData.images.length > 0 ? (
                          newDisasterData.images.map((image, index) => (
                            <img
                              key={index}
                              src={typeof image === 'string' ? image : image.url}
                              alt={`Image ${index + 1}`}
                              style={{ width: "100px", height: "auto", marginRight: "10px" }}
                            />
                          ))
                        ) : null
                      }


                    </FormGroup>
                    <Button color="primary" onClick={handleUpdateSubmit}>
                      Update
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
                          <Carousel  {...settings}>
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
                        <td style={{ width: '400px',}}>{row.bdescription}</td>
                        <td> {/* No specific width for the entire cell */}
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
                            onClick={() => handleUpdateClick(row)}
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
