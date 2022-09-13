import { useRef, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import style from "../styles/card.module.scss";
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import { TbEdit } from 'react-icons/tb';
import { TiTick } from 'react-icons/ti';

import Figure from 'react-bootstrap/Figure';
import UserService from '../services/userService';

function MyCard(props) {

    const initData = (props && props.data?.length > 0) ? [...props.data] : [];
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [modalData, setModalData] = useState({});
    const [showImg, setShowImg] = useState(false);
    const [userProps, setUserProps] = useState(["height", "weight", "age"]);
    let intrId = useRef([]);

    useEffect(() => {
        let u = new UserService();
        u.getUsers("https://dummyjson.com/users?limit=21")
            .then((resp) => {
                setUsers(resp.data.users);
            }).catch((err) => {
                console.log("CARD-COMPONENT:: USER FETCH ERROR:", err);
            });
        // return () => console.log("use effect Cleanup..");
    }, []);

    const checkImgName = (imgUrl, profilePicUrl) => {
        if (!imgUrl)
            return false;
        if (!profilePicUrl)
           return false;
        let imgOnTrey = imgUrl.split('/').pop();
        let imgOnModal = profilePicUrl.split('/').pop();
            return imgOnModal === imgOnTrey;
    }

    const onInfoButtonClick = (e, userOb) => {
        setModalData(userOb);
        setShowModal(true);
    }

    const onMoueOverOnCard = (e, user, idx, isIn) => {
        e.preventDefault();
        clearIntervalIds(intrId.current, user, idx);
        var intervalIds = [];
        if (isIn) {
            let changable1 = null; let changable2 = null; let changable3 = null;
            // debugger
            userProps.forEach(userKey => {
                let userVal = user[userKey];
                var changable1_c = 0;
                var changable2_c = 0;
                var changable3_c = 0;
                // debugger
                if (!(changable1 || changable2 || changable3)) {
                    changable1 = document.querySelector("#changable_1" + idx);
                    changable2 = document.querySelector("#changable_2" + idx);
                    changable3 = document.querySelector("#changable_3" + idx);
                    var intr = setInterval(() => {
                        changable1.innerHTML = (user.weight > changable1_c) ? ++changable1_c : user.weight;
                        changable2.innerHTML = (user.height > changable2_c) ? ++changable2_c : user.height;
                        changable3.innerHTML = (user.age > changable3_c) ? ++changable3_c : user.age;
                    }, 10);
                    intrId.current.push(intr);
                }
            });
        } else {
            clearIntervalIds(intrId.current, user, idx);
        }
    }

    const clearIntervalIds = (idarr, user, idx) => {
        if (idarr && idarr.length > 0) {
            var tempArr = [...idarr];
            idarr.forEach(id => {
                clearInterval(id);
                tempArr.splice(idarr.indexOf(id), 1);
            });
            idarr = tempArr && tempArr.length >= 0 ? tempArr : [];
            intrId.current = idarr;
        }
        if (user) {
            var changable1 = document.querySelector("#changable_1" + idx);
            var changable2 = document.querySelector("#changable_2" + idx);
            var changable3 = document.querySelector("#changable_3" + idx);
            if (changable1 && changable2 && changable3) {
                changable1.innerHTML = user.weight;
                changable2.innerHTML = user.height;
                changable3.innerHTML = user.age;
            }
        }
    }

    return (
        <div className="mycard-wrapper">
            <Container className='cardContainer'>
                {initData && initData.map((c, idx) => {
                    return (
                        <div key={idx}>

                            <Card className='myCard' style={{ position: 'relative', background: '#fffff' }}
                                onMouseEnter={(e) => onMoueOverOnCard(e, c, idx, true)} onMouseLeave={(e) => onMoueOverOnCard(e, c, idx, false)}>
                                <div className={`${style.cardContentCurved}`} />
                                <Card.Title style={{ position: 'absolute', top: '15px', left: '15px', color: 'white' }}>{c.firstName} {c.lastName}</Card.Title>
                                <Card.Title style={{
                                    position: 'absolute', top: '15px', right: '15px',
                                    color: 'white', fontSize: '0.8em'
                                }}>{c.id}</Card.Title>
                                <Card.Img className={`${style.cardImage} cardImageHover`} variant="top" src={c.image} />
                                <div className='cardBody'>
                                    <Card.Body style={{ padding: '4rem 10px 10px 10px', marginTop: '3.2em' }}>
                                        <div className={`${style.separator}`}></div>
                                        <div className={`${style.counterContent}`}>
                                            <span id={`changable_1${idx}`} title='WEIGHT'>{c.height}</span><span className={`${style.lineSeparetor}`}></span>
                                            <span id={`changable_2${idx}`} title='HEIGHT'>{c.weight}</span><span className={`${style.lineSeparetor}`}></span>
                                            <span id={`changable_3${idx}`} title='AGE'>{c.age}</span>
                                        </div>
                                    </Card.Body>
                                    <Card.Body>
                                        <Card.Text elementType='div'>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card&apos;s content.
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Body>
                                        <Button title="More Info" size="sm" onClick={(e) => onInfoButtonClick(e, c)}
                                            variant="outline-secondary" className={`${style.infoButton}`}>
                                            <i>i</i>
                                        </Button>{' '}
                                        <Button title="" size="sm" variant="outline-danger">Delete</Button>{' '}
                                    </Card.Body>
                                </div>

                            </Card>


                        </div>
                    )
                })}
            </Container>

            <Modal size='xl' className='cardModal'
                show={showModal}
                onHide={() => setShowModal(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton className={`${style.modalHeaderStyle}`}>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {modalData.firstName} {modalData.lastName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${style.modalBody}`} style={{ height: '82vh' }}>
                    <Container className={`${style.container}`}>
                        <Row className={`${style.rowStyle}`}>
                            <Col xs={2} className={`${style.withBorder}`}>
                                <div className={`userLogo`} style={{ position: "relative" }}>
                                    <div className='cardPopupImage'>
                                        <Image alt="IMG1" className={`${style.profileImg}`} src={modalData.image} roundedCircle />
                                    </div>
                                    <div className='cardPopupImageEdit'>
                                        <Button className={`rounded-circle ${style.profileEditBtn}`}
                                            onClick={() => setShowImg(!showImg)}>
                                            <TbEdit className={`${style.cardEditIcon}`} />
                                        </Button>{' '}
                                    </div>
                                </div>
                                {showImg && users && <div className={`${style.cardPopupImgTrey}`}>
                                    <Card body className={`${style.imgTreyCard}`}>
                                        {users.map((u, idx) => {
                                            return (
                                                <Figure key={idx} style={{position: 'relative'}}>
                                                    <Figure.Image
                                                        className={`${style.figureImg}`}
                                                        width={40}
                                                        height={55}
                                                        alt={`IMG${idx}`}
                                                        src={u.image} />
                                                    {u.image  && modalData.image && checkImgName(u.image, modalData.image)
                                                         && <span className={`${style.greenTick}`}><TiTick color="green" className={`${style.tickIcon}`}/></span>}
                                                </Figure>
                                            )
                                        })}
                                    </Card>
                                </div>
                                }
                            </Col>
                            <Col className={`${style.withBorder}`}>2 of 3</Col>
                            <Col xs={3} className={`${style.withBorder}`}>3 of 3</Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </div >
    );
}

export default MyCard;