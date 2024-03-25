import storeItems from "../data/items.json"
import { Row, Col } from "react-bootstrap"
import { StoreItem } from "../components/StoreItem"

export function Store(){
    return(
        <>
            <h1 className="text-center mb-3">Store</h1>
            <Row md={2} xs={1} lg={3} className="g-3">
                {storeItems.items.map(item => (
                    <Col key={item.id}>
                        <StoreItem {...item}/>
                    </Col>
                ))}
            </Row>
        </>
    ) 
}