import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  Form,
  Button,
} from "reactstrap";
import {Carousel } from 'react-bootstrap';

function Disaster() {
  const [tableData, setTableData] = useState({});
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    // Fetch data from your backend API
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
  }, []);
console.log(tableData)
console.log(tableData.disasters)
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true, // Experiment with this option
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


  const handleModalToggle = () => {
    console.log("modal")
    setShowModal(!showModal);
  };
  const handleSaveNewDisaster = () => {
    // Implement logic to save the new disaster
    // This function should handle saving data and closing the modal
    // For simplicity, let's just close the modal for now
    setShowModal(false);
  };
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">Disaster List <Button
                    color="primary"
                    className="float-right"
                    onClick={handleModalToggle}
                  >
                    New Disaster
                  </Button></CardTitle>
                <p className="card-category">
                  A disaster is a serious problem occurring over a period of
                  time that causes widespread human, material, economic, or
                  environmental loss, which exceeds the ability of the affected
                  community or society to cope using its own resources.
                </p>
              </CardHeader>
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
      <Modal show={showModal} onHide={handleModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Disaster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your form for creating a new disaster */}
          <Form>
            {/* Form fields go here */}
            {/* For example: */}
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter disaster name" />
            </Form.Group>
            {/* Add other form fields as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalToggle}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewDisaster}>
            Save Disaster
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Disaster;
