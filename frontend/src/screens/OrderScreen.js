import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";

import { detailsOrder, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function OrderScreen() {
  const orderid = useParams()["id"];
  const [sdkReady, setSdkReady] = React.useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);

  const { order, loading, error } = orderDetails;

  const dispatch = useDispatch();
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;

  React.useEffect(() => {
    const addPayPalSdkScript = async () => {
      const { data } = await Axios.get("/api/config/paypal");
      console.log("data", data);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://www.paypal.com/sdk/js?client-id=" + data;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
        console.log("sdk ready");
      };
      document.body.appendChild(script);
    };
    if (!order || successPay || (order && order._id !== orderid)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(detailsOrder(orderid));
    } else {
      console.log("order", order);
      if (!order.isPaid) {
        console.log("order.isPaid", order.isPaid);
        if (!window.paypal) {
          console.log("window.paypal", window.paypal);
          addPayPalSdkScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, order, successPay, orderid, sdkReady]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Order {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping </h2>
                <p>
                  <strong>Name</strong> {order.shippingAddress.FullName}
                  <br />
                  <strong>Address</strong>{" "}
                  {order.shippingAddress.Address +
                    "," +
                    order.shippingAddress.City +
                    "," +
                    order.shippingAddress.PostalCode +
                    "," +
                    order.shippingAddress.Country}
                </p>
                {order.idDelivered ? (
                  <MessageBox variant="success">
                    Delivered At: {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method</strong> : {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid At {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt="item.name"
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={"/product/" + item.product}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty +
                            " x " +
                            item.price +
                            " = " +
                            item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>{order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>{order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>{order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Total</strong>
                  </div>
                  <div>
                    <strong>{order.totalPrice.toFixed(2)}</strong>{" "}
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox />
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
                    </>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
