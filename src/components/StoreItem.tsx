import { Stack, Button, Card, Form, Modal } from "react-bootstrap"
import { formatCurrency } from "../utilities/formatCurrency"
import { useShoppingCart } from "../context/ShoppingCartContext"
import  { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'

import axios from "axios"


type StoreItemProps = {
    id: number
    prodName: string
    price: number
    imgUrl: string
    shortDesc: string
    longDesc: string
}

export function StoreItem({ id, prodName, price, imgUrl, shortDesc, longDesc }: StoreItemProps) {
    const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart} = useShoppingCart()
    const quantity = getItemQuantity(id)

    const [editShowModal, editSetShowModal] = useState(false);
    const [viewShowModal, viewSetShowModal] = useState(false);

    const editHandleClose = () => editSetShowModal(false);
    const editHandleShow = () => editSetShowModal(true);

    const viewHandleClose = () => viewSetShowModal(false);
    const viewHandleShow = () => viewSetShowModal(true);

    //Updating the Data:
    const [values, setValues] = useState({
        id: uuidV4(),
        prodName: '',
        price: '',
        updatedImgUrl: '',
        shortDesc: '',
        longDesc: ''
    })
    
    const handleUpdate = (event) => {
        event.preventDefault();
    
        // Check if any field is empty
        for (const key in values) {
            if (values.hasOwnProperty(key) && !values[key]) {
                alert("Please change all fields.");
                return; // Prevent submission if any field is empty
            }
        }
        

        const fileInput = document.getElementById("updatedImgUrl");
        const file = fileInput.files[0];
        

        if (file) {
            // Generate a unique filename for the image
            const filename = uuidV4() + "_UPDATED IMAGE:" + file.name;

            // Save the image file to localStorage (for demonstration purposes)
            localStorage.setItem(filename, URL.createObjectURL(file));

            // Update the values with the image URL
            setValues({ ...values, updatedImgUrl: filename });

            // Proceed with updating other fields (e.g., prodName, price, etc.)
            // using axios or any other method
            

            axios.put(`http://localhost:3000/items/${id}`, values)
                .then(res => {
                    console.log(res);
                    editHandleClose();
                    window.location.reload();
                })
                .catch(err => console.log(err));
        } else {
            console.error("No file selected");
        }
    }
    

    //DELETING
    const handleDelete = (id) => {
        const confirm = window.confirm("Would you like to Delete the product?")
        if(confirm){
            axios.delete(`http://localhost:3000/items/${id}`)
            .then(res =>{
                editHandleClose();
                window.location.reload();
            })
            .catch(err => console.log(err));
        }
    }

    return(
        <>
            <Card className="h-100">
                <Card.Img variant="top" src={values.updatedImgUrl || imgUrl} height="200px" style={{objectFit: "cover"}} />
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
                        <span className="fs-2">{prodName}</span>
                        <span className="ms-2 text-muted">{formatCurrency(price)}</span>
                    </Card.Title>
                    <div className="mt-auto">
                        {quantity === 0 ?(
                            <Button className="w-100" onClick={() => increaseCartQuantity(id)}>+ Add to Cart</Button>
                        ) : <div className="d-flex align-items-center flex-column" style={{gap: ".5rem"}}>
                                <div className="d-flex align-items-center justify-content-center" style={{gap: ".5rem"}}>
                                    <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
                                    <div>
                                        <span className="fs-3">{quantity}</span> in cart
                                    </div>
                                    <Button onClick={() => increaseCartQuantity(id)}>+</Button>
                                </div>
                                <Button variant="danger" size="sm" onClick={() => removeFromCart(id)}>Remove</Button>
                            </div>}
                    </div>
                    <Stack direction="horizontal" gap={2} className="mt-2">
                        <Button variant="outline-secondary" className="w-100" onClick={editHandleShow}>Edit</Button>
                        <Button variant="outline-info" className="w-100" onClick={viewHandleShow}>View</Button>
                    </Stack>
                </Card.Body>
            </Card>

            {/* FORM for EDITING THE PRODUCT */}
            <Modal show={editShowModal} onHide={editHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                    <Button className="ms-3" variant="danger" type="submit" onClick={() => handleDelete(id)}>
                        Delete
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3" controlId="prodName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control className="text-muted" type="text" placeholder="Enter product name" defaultValue={prodName} onChange={e => setValues({...values, prodName: e.target.value})} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Price" defaultValue={price} onChange={e => setValues({...values, price: e.target.value})} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="shortDesc">
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control type="text" placeholder="Short Description" defaultValue={shortDesc} onChange={e => setValues({...values, shortDesc: e.target.value})} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="longDesc">
                            <Form.Label>Long Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Long Description" defaultValue={longDesc} onChange={e => setValues({...values, longDesc: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="updatedImgUrl">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" placeholder="Image" onChange={e => setValues({...values, updatedImgUrl: e.target.value})} required />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={editHandleClose} >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate} type="submit">
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* MODAL FOR VIEWING OF THE PRODUCT */}
            <Modal show={viewShowModal} onHide={viewHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>View Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack direction="horizontal" className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center w-100 gap-2">
                                <Card.Img className="rounded" variant="top" src={imgUrl} height="200px" style={{objectFit: "cover"}} />
                                <div className="w-100 d-flex flex-column gap-1">
                                    <h5 className="fs-4 text-bold">{prodName}</h5>
                                    <p className="text-normal">Price: {formatCurrency(price)}</p>
                                    <p className="text-normal">{shortDesc}</p>
                                </div>
                        </div>
                        <p className="w-100 mt-4">{longDesc}</p>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={viewHandleClose} >
                        Back
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

