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
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);

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
    setNewDisasterData({
      name: "",
      description: "",
      images: [],
      // Add other necessary fields
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
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
 
  const handleImageChangeCreate = (e) => {
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
  const openUpdateModal = async (row) => {
    console.log(row._id)
    try {
      if (!row || !row._id) {
        console.error("Invalid row or row id:", row);
        return;
      }
  
      console.log("Fetching old data for ID:", row._id);
  
      // Log the URL for debugging
      const apiUrl = `http://localhost:4001/api/v1/disasters/${row._id}`;
      console.log("API URL:", apiUrl);
  
      // Fetch old data for the selected disaster
      const response = await axios.get(apiUrl);
      const oldData = response.data.disaster;
      
      // Set the old data to newDisasterData state
      setNewDisasterData({
        name: oldData.name,
        description: oldData.description,
        images: oldData.images,
        // Add other necessary fields
      });

      // Set the updateId state
      setUpdateId(row._id);
  
      // Open the update modal
      setUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching old data:", error);
    }
  };
  

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setUpdateId(null); // Reset the updateId state when closing the modal
  };

  const handleUpdateClick = (row) => {
    // Call the function to open the update modal
    openUpdateModal(row);
  };
  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newDisasterData.name);
      formData.append("description", newDisasterData.description);
  
      if (Array.isArray(newDisasterData.images)) {
        newDisasterData.images.forEach((image, index) => {
          // Check if the image is a file object
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          } else if (typeof image === 'string') {
            // If it's a string (link), append it directly to the form data
            formData.append(`images[${index}]`, image);
          }
        });
      }
      console.log(formData);
  
      // Send the form data to the backend for update, using the updateId state
      const response = await axios.put(
        `http://localhost:4001/api/v1/admin/disaster/${updateId}`,
        formData
      );
  
      // Handle the response as needed
      console.log(response.data);
      closeUpdateModal();
      // Refresh the data after successful update
      setDataRefresh(true);
  
      // Close the modal after successful submission
      
    } catch (error) {
      // Handle errors
      console.error("Error submitting update:", error);
      // You can add additional error handling here, such as displaying an error message to the user
    }
  };
  
  const handleDeleteClick = (row) => {
    // Implement logic for deleting the disaster
    console.log('Delete clicked for:', row);
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
          onChange={handleImageChangeCreate}
          accept="image/*"
        />
     {newDisasterData.images &&
    newDisasterData.images.map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
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
       {/* Display preview of uploaded images */}
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

      {/* Submit button */}
      <Button color="primary" onClick={handleUpdateSubmit}>
        Update
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
                        <td>
        {/* Update Button */}
        <Button
          color="info"
          onClick={() => handleUpdateClick(row)}
        >
          Update
        </Button>
      </td>
      <td>
        {/* Delete Button */}
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

export default Disaster;
