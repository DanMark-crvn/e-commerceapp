import { Modal, Form, Button, Container, Nav, Navbar as NavbarBs } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import {writeDataToFile} from '../hooks/writeToFile';

export function Navbar() {
    const { openCart, cartQuantity } = useShoppingCart();
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState({
        id: uuidV4(),
        prodName: "",
        price: "",
        shortDesc: "",
        longDesc: "",
        imgUrl: ""
    });

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    function submit(e) {
        e.preventDefault();

        // Save the form data to localStorage
        localStorage.setItem('formData', JSON.stringify(data));

        // Write the form data to a local JSON file
        writeDataToFile(data);

        // Reset the form data after submission
        setData({
            id: uuidV4(),
            prodName: "",
            price: "",
            shortDesc: "",
            longDesc: "",
            imgUrl: ""
        });

        handleClose();
        window.location.reload();
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageDataUrl = event.target.result;
                setData({ ...data, imgUrl: imageDataUrl });
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <NavbarBs sticky="top" className='bg-white shadow-sm mb-3'>
                <Container className="">
                    <NavbarBs.Brand className="bg-secondary rounded text-light p-2" href="/">E-Commerce App</NavbarBs.Brand>
                    <Nav className="me-auto">
                        <Nav.Link to={"/"} as={NavLink}>Home</Nav.Link>
                        <Nav.Link to={"/store"} as={NavLink}>Store</Nav.Link>
                    </Nav>
                    <Button className="me-3" variant="success" onClick={handleShow}>
                        <i className='bx bx-plus-circle fs-5'></i>
                    </Button>
                    {cartQuantity > 0 && (
                        <Button onClick={openCart} variant="outline-primary" style={{position: "relative"}}>
                            <i className='bx bxs-cart-alt bx-sm'></i>
                            <div className="rounded-circle bg-danger justify-content-center align-items-center text-light" style={{width: "1.5rem", height: "1.5rem", position: "absolute", bottom: "-5px", right: "-5px", transform: "tanslate(25%, 25%)"}}>{cartQuantity}</div>
                        </Button>
                    )}
                </Container>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => submit(e)}>
                            <Form.Group className="mb-3" controlId="prodName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter product name" onChange={(e) => setData({...data, prodName: e.target.value})} value={data.prodName} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" placeholder="Price" onChange={(e) => setData({...data, price: e.target.value})} value={data.price} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="shortDesc">
                                <Form.Label>Short Description</Form.Label>
                                <Form.Control type="text" placeholder="Short Description" onChange={(e) => setData({...data, shortDesc: e.target.value})} value={data.shortDesc} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="longDesc">
                                <Form.Label>Long Description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Long Description" onChange={(e) => setData({...data, longDesc: e.target.value})} value={data.longDesc} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="imgUrl">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" placeholder="Image" onChange={handleFileChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </NavbarBs>
        </>
    );
}
