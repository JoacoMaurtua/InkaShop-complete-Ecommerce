import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { listMyOrders } from '../actions/orderActions';
//import { LinkContainer } from 'react-router-boostrap';

const ProfileScreen = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState(null); //passwords hacen o no match

  const { name, email, password, confirmPassword } = state;

  const dispatch = useDispatch();

  //SOLUCION ALTERNATIVA
  const userDetails  = useSelector((state) => state.userDetails );
  const { loading, error, user } = userDetails ;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;
  
  console.log('orders:',orders);

  const history = useHistory();

  //Nos redirija a la pagina si ya estamos logueados
  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      if (!user || !user.name || success) {
        dispatch(getUserDetails('user/profile')); // ---> forma la ruta
        dispatch(listMyOrders());
      } else {
        setState({
          name: user.name,
          email: user.email,
        });
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      //DISPATCH UPDATE PROFILE
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <Row>
      <Col md={3}>
        {' '}
        {/* datos del user */}
        <h2> User Profile </h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile Updated!</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name: </Form.Label>
            <Form.Control
              style={{ marginBottom: '1rem' }}
              type="name"
              placeholder="Enter your name"
              name="name"
              value={name}
              onChange={onChangeHandler}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address: </Form.Label>
            <Form.Control
              style={{ marginBottom: '1rem' }}
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={onChangeHandler}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password: </Form.Label>
            <Form.Control
              style={{ marginBottom: '1rem' }}
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={onChangeHandler}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password: </Form.Label>
            <Form.Control
              style={{ marginBottom: '1rem' }}
              type="password"
              placeholder="Confirm your Password please"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChangeHandler}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        {' '}
        {/* ordenes del usuario */}
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orders) => (
                <tr key={orders._id}>
                  <td>{orders._id}</td>
                  <td>{orders.createdAt.substring(0, 10)}</td>
                  <td>{orders.totalPrice}</td>
                  <td>
                    {orders.isPaid ? (
                      orders.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>

                  <td>
                    {orders.isDelivered ? (
                      orders.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${orders._id}`}>
                      <Button variant="light">Details</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
