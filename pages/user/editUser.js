import { useRef, useState, useEffect, React } from 'react';
import UserService from '../../services/userService';
import Table from 'react-bootstrap/Table';
import style from '../../styles/user.module.scss';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import User from './user';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';


function EditUser(props) {
    const [users, setUsers] = useState([]);
    const spinnerRef = useRef(null);
    const [checkedUsers, setCheckedUsers] = useState([]);
    const [timeoutId, setTimeoutId] = useState(null);
    const [showChild, setShowChild] = useState(null);

    useEffect(() => {
        show(spinnerRef.current);
        let u = new UserService();
        u.getUsers("https://dummyjson.com/users?limit=100")
            .then((resp) => {
                hide(spinnerRef.current);
                resp.data.users.map(u => {
                    u.checked = false;
                    return u;
                });
                setUsers(resp.data.users);
            })
            .catch((err) => {
                console.log("EDIT-USER-COMPONENT:: USER FETCH ERROR: ", err);
            });
        // return () => console.log("EditUser useEffect cleanup..");
    }, []);

    const hide = (el) => {
        if (!el) return;
        el.attributeStyleMap.set('display', 'none');
    };

    const show = (el) => {
        if (!el) return;
        if (el.attributeStyleMap.get('display')?.value === 'none')
            el.attributeStyleMap.delete('display');
    };

    const _onChecked = (e, idx) => {
        // debugger
        let clonedUsers = [...users];
        if (idx < 0) {
            // set true for all user object
            clonedUsers.map(u => u.checked = !u.checked);
            setCheckedUsers([]);
            if (clonedUsers[0].checked)
                setCheckedUsers([...clonedUsers]);
        } else {
            // set true for specific user object
            let u = clonedUsers[idx];
            u.checked = !u.checked;
            if (u.checked)
                checkedUsers.push(u);
            else {
                for (var idx in checkedUsers) {
                    if (checkedUsers[idx].id == u.id)
                        checkedUsers.splice(idx, 1);
                }
            }
            setCheckedUsers(checkedUsers);
        }
        setUsers(clonedUsers);
    };

    const _onInputChange = (e, idx) => {
        let name = e.target.getAttribute("name");
        let clonedUsers = [...users];
        let userOb = clonedUsers[idx];
        var val = e.target.value;
        var tid = null;
        if (name === 'firstNameLastName') {
            userOb.firstName = val.split(" ")[0];
            userOb.lastName = val.split(" ")[1];
        } else if (name === 'hairColorType') {
            var _val = val.split(" ");
            if (!_val || _val.length < 2) {
                userOb.hair.color = _val[0];
                userOb.hair.type = '';
                e.target.focus();
                tid = setTimeout(() => {
                    e.target.style = "border: solid orange";
                    alert(`Invaid 'hairColor' value at line: ${idx + 1}. Example: 'blond-curley`);
                }, 2000);
                setTimeoutId(tid);
            } else {
                userOb.hair.color = _val[0];
                userOb.hair.type = _val[1];
                clearTimeout(timeoutId);
                e.target.style = "border: 1px solid lightgrey";
            }
        } else {
            userOb[name] = val;
        }
        clonedUsers.splice(idx, 1);
        clonedUsers.splice(idx, 0, userOb);
        setUsers(clonedUsers);
    }

    const _onAnyActon = (e, action) => {
        setShowChild(false);
        switch (action) {
            case 2:
                setShowChild(false);
                var dataToSet = [...checkedUsers];
                props.parentData(dataToSet);
                setShowChild(true);
                break;

            default:
                break;
        }
    }

    return (
        <div className="edit-user-wrapper" style={{ height: '100% !important' }}>
            <Card className={`${style.margin}`} style={{ height: 'inherit !important' }}>
                <Card.Header as="h5">
                    <span className='primaryHeaderText'>USER DETAILS</span>
                    <span className={`${style.primaryHeaderLoader}`}>
                        <Spinner animation="grow" variant="primary" ref={spinnerRef} />
                    </span>
                </Card.Header>
                <Card.Body>
                    <Card.Title as="h6" className='cardTitle'>
                        <span className={`${style.cursor}`}>
                            <DropdownButton
                                size='sm'
                                as={ButtonGroup}
                                title="Actions"
                                id="bg-vertical-dropdown-1">
                                <Dropdown.Item style={{ fontSize: 'small' }} title='Update one or more checked records'
                                    onClick={(e) => _onAnyActon(e, 0)}>Update Record(s)</Dropdown.Item>
                                <Dropdown.Item style={{ fontSize: 'small' }} title='Delete one or more checked records'
                                    onClick={(e) => _onAnyActon(e, 1)}>Delete Record(s)</Dropdown.Item>
                                <Dropdown.Item style={{ fontSize: 'small' }} title='View one or more checked records details'
                                    onClick={(e) => _onAnyActon(e, 2)}>View Details</Dropdown.Item>
                            </DropdownButton>
                        </span>
                    </Card.Title>


                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header className={`${style.editUserAccordionHeader}`}>All Users</Accordion.Header>
                            <Accordion.Body className={`${style.editUserAccordionNody1}`}>

                                <Card.Text elementType='<div>'>
                                    <div className='divStyle'>
                                        <Table Table striped bordered hover size="sm" className='myTable'>
                                            <thead className='headerStyle'>
                                                <tr>
                                                    <th><Form.Check onChange={(e) => _onChecked(e, -1)} /></th>
                                                    <th>Name[FN LN]</th>
                                                    <th>Email</th>
                                                    <th>UserName</th>
                                                    <th>EIN</th>
                                                    <th>Gender</th>
                                                    <th>Weight</th>
                                                    <th>Blood Group</th>
                                                    <th>Hair(color-type)</th>
                                                    <th>DOB</th>
                                                    <th>Age</th>
                                                    <th>Adult</th>
                                                </tr>
                                            </thead>
                                            <tbody className='bodyStyle'>
                                                {users.map((u, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td>
                                                                <Form.Check checked={u.checked} key={u.id} onChange={(e) => _onChecked(e, idx)} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="Joe Smith" name="firstNameLastName" value={`${u.firstName} ${u.lastName}`} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="email" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="joe@yahoo.com" name="email" value={u.email} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="joe123" name="username" value={u.username} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="ein num: 20-12345" name="ein" value={u.ein} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="male/female" name="gender" value={u.gender} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="70.5" name="weight" value={u.weight} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="A+" name="bloodGroup" value={u.bloodGroup} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="Blond-Curley" name="hairColorType" value={`${u.hair.color} ${u.hair.type}`} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="27-05-1992" name="birthDate" value={u.birthDate} />
                                                            </td>
                                                            <td>
                                                                <Form.Control className='tableInputBox' size="sm" type="text" onChange={(e) => _onInputChange(e, idx)}
                                                                    placeholder="30" name="age" value={u.age} />
                                                            </td>
                                                            <td>{(u.age >= 18) ? <span style={{ color: 'green', fontWeight: 'bold' }}> Y </span>
                                                                : <span style={{ color: 'red', fontWeight: 'bold' }}>N</span>}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Text>

                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Selected Users</Accordion.Header>
                            <Accordion.Body className={`${style.editUserAccordionBody}`}>
                                {!showChild &&
                                    <Alert variant="danger">
                                        <Alert.Heading>Oh snap! No Users To Show!</Alert.Heading>
                                        <p>
                                            Please select one or more users from table and click on
                                            <b> Actions {'>>'} View Details</b> to see list of users in this section.
                                        </p>
                                    </Alert>
                                }
                                <div className="child-component-wrapper">
                                    {showChild && <User inputData={[...checkedUsers]} />}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            </Card>
        </div>
    );
}

export default EditUser;