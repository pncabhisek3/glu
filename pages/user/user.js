import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import style from '../../styles/user.module.scss';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useRef, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyCard from '../../components/card';



function User(props) {

    console.log('inputData: ', props, props.inputData);
    let cardData= props && props.inputData ? props.inputData : [];
    cardData = !Array.isArray(cardData) ?  [] : cardData;
    const defaultHeader = useRef(null);
    const switchInput = useRef(null);
    const users = [];
    
    useEffect(() => {
        // return () => console.log("use effect Cleanup..");
    }, []);

    const toggleGender = (e, gen) => {
        var el = document.querySelectorAll(".user-switch");
        return false;
    }

    const fire = (e) => {
        e.preventDefault();
    };

    return (

        <div className="user-wrapper">
            {cardData && <MyCard data={[...cardData]} />}
        </div>

        // <div className="user-wrapper">
        //     <Container >
        //         <Card className={`${style.margin}`}>
        //             <Card.Header as="h5">USER PROFILE INPUT</Card.Header>
        //             <Card.Body>
        //                 <Card.Title as="h6">Modify Details</Card.Title>
        //                 <Card.Text>
        //                     <Form style={{overflowX: 'hidden'}}>
        //                         <Row className="mb-1">
        //                             <Form.Group as={Col} controlId="formGridEmail">
        //                                 <FloatingLabel controlId="floatingInput" label="Email address" className={`mb-2 ${style.padding5}`} >
        //                                     <Form.Control type="email" placeholder="Enter email" className={`${style.formControlSm}`} />
        //                                 </FloatingLabel>
        //                             </Form.Group>

        //                             <Form.Group as={Col} controlId="formGridPassword">
        //                                 <FloatingLabel controlId="floatingInput" label="Password" className="mb-1" >
        //                                     <Form.Control type="password" placeholder="Password" />
        //                                 </FloatingLabel>
        //                             </Form.Group>
        //                         </Row>

        //                         <Form.Group className="mb-2" controlId="formGridAddress1">
        //                             <FloatingLabel controlId="floatingInput" label="Address" className="mb-11" >
        //                                 <Form.Control placeholder="1234 Main St" />
        //                             </FloatingLabel>
        //                         </Form.Group>

        //                         <Form.Group className="mb-2" controlId="formGridAddress2">
        //                             <FloatingLabel controlId="floatingInput" label="Address 2" className="mb-2" >
        //                                 <Form.Control placeholder="Apartment, studio, or floor" />
        //                             </FloatingLabel>
        //                         </Form.Group>

        //                         <Row className="mb-2">
        //                             <Form.Group as={Col} controlId="formGridCity">
        //                                 <FloatingLabel controlId="floatingInput" label="City" className="mb-2" >
        //                                     <Form.Control placeholder="Mention City" />
        //                                 </FloatingLabel>
        //                             </Form.Group>

        //                             <Form.Group as={Col} controlId="formGridState">
        //                                 <FloatingLabel controlId="floatingInput" label="State" className="mb-2" >
        //                                     <Form.Select>
        //                                         <option>...</option>
        //                                     </Form.Select>
        //                                 </FloatingLabel>
        //                             </Form.Group>

        //                             <Form.Group as={Col} controlId="formGridZip">
        //                                 <FloatingLabel controlId="floatingInput" label="Zip" className="mb-2" >
        //                                     <Form.Control placeholder='Zipcode' />
        //                                 </FloatingLabel>
        //                             </Form.Group>
        //                         </Row>

        //                         <Form.Group className="mb-2" id="formGridCheckbox">
        //                             <Form.Check inline type="switch" id="custom-switch-1" className='user-switch'
        //                                 ref={switchInput} label="Male" onChange={(e) => toggleGender(e, 'M')} />
        //                             <Form.Check inline type="switch" id="custom-switch-2" className='user-switch'
        //                                 ref={switchInput} label="Female" onChange={(e) => toggleGender(e, 'F')} />
        //                         </Form.Group>
        //                     </Form>

        //                 </Card.Text>
        //                 <Button variant="primary" type="submit" onClick={(e) => fire(e)}> Submit </Button>
        //             </Card.Body>
        //         </Card>
        //     </Container>
        // </div>
    );
}

export default User;