import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
// reactstrap components
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
import {Carousel } from 'react-bootstrap';

function Disaster() {
  const [tableData, setTableData] = useState({});
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newDisasterData, setNewDisasterData] = useState({
    name: "",
    description: "",
    images: [],
    // Add other necessary fields
  });
  const [dataRefresh, setDataRefresh] = useState(true);

  useEffect(() => {
    if (dataRefresh) {
      // Fetch data again
      fetch("http://localhost:4001/api/v1/disasters")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setTableData(data.disasters))
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
        });
  
      // Reset the data refresh state
      setDataRefresh(false);
    }
  }, [dataRefresh]);
console.log(tableData)
console.log(tableData.disasters)
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1, // Make sure it is spelled correctly
  fade: true,
};

  // Check for errors
  if (error) {
    return (
      <div className="content">
        <p>Error loading data. Please check your network connection and try again.</p>
      </div>
    );
  }

  // Check if tableData is an object
  if (typeof tableData !== "object" || tableData === null) {
    console.error("tableData is not an object:", tableData);
    // Handle this error state (display a message, show a loading spinner, etc.)
    return (
      <div className="content">
        <p>Loading...</p>
      </div>
    );
  }

  // Convert the object properties to an array for mapping
  const dataEntries = Object.entries(tableData);

  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewDisasterData({
      ...newDisasterData,
      images: files,
    });
  };
  // Function to handle form submission
  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newDisasterData.name);
      formData.append("description", newDisasterData.description);
  
      newDisasterData.images.forEach((image) => {
        formData.append("images", image);
      });
  
      // Send the form data to the backend
      const response = await axios.post("http://localhost:4001/api/v1/admin/disaster/new", formData);
      setDataRefresh(true);
      // Handle the response as needed
      console.log(response.data);
  
      // Close the modal after successful submission
      closeModal();
    } catch (error) {
      // Handle errors
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">Disaster List  <Button color="primary" className="float-right" onClick={openModal}>
              New Disaster
            </Button></CardTitle>
                <p className="card-category">
                  A disaster is a serious problem occurring over a period of
                  time that causes widespread human, material, economic, or
                  environmental loss, which exceeds the ability of the affected
                  community or society to cope using its own resources.
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
          onChange={handleImageChange}
          accept="image/*"
        />
        {/* Display preview of uploaded images */}
        {newDisasterData.images &&
          newDisasterData.images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Image ${index + 1}`}
              style={{ width: "100px", height: "auto", marginRight: "10px" }}
            />
          ))}
      </FormGroup>

      {/* Submit button */}
      <Button color="primary" onClick={handleFormSubmit}>
        Submit
      </Button>
    </Form>
  </ModalBody>
  {/* ... (previous code) */}
</Modal>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Images</th>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataEntries.map(([key, row], index) => (
                      <tr key={index}>
                        
                        <td>
                        <Carousel  {...settings}>
                {row.images.map((image, imageIndex) => (
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
                        <td>{row.name}</td>
                        <td>{row.description}</td>
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

export default Disaster;
