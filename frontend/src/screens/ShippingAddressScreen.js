import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";
import { useNavigate } from "react-router-dom";

export default function ShippingAddressScreen() {
  const navigate = useNavigate();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  React.useEffect(() => {
    if (!userInfo) {
      console.log("fired");
      navigate("/signin");
    }
  }, [navigate, userInfo]);

  const [FullName, setFullName] = useState(shippingAddress.FullName);
  const [Address, setAddress] = useState(shippingAddress.Address);
  const [City, setCity] = useState(shippingAddress.City);
  const [PostalCode, setPostalCode] = useState(shippingAddress.PostalCode);
  const [Country, setCountry] = useState(shippingAddress.Country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ FullName, Address, City, PostalCode, Country })
    );
    navigate("/payment");
  };

  return (
    <div>
      <CheckoutSteps step1={true} step2={true}></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Shipping Address</h1>
        </div>
        <div>
          <label htmlFor="fullname">Full Name</label>
          <input
            id="fullname"
            type="text"
            placeholder="Enter Full Name"
            value={FullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Enter Address"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="Enter City"
            value={City}
            onChange={(e) => setCity(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="postalcode">Postal Code</label>
          <input
            id="postalcode"
            type="text"
            placeholder="Enter Postal Code"
            value={PostalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            placeholder="Enter Country"
            value={Country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
