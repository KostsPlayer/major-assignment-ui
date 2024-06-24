import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";

export default function Address() {
  axios.defaults.withCredentials = true;

  const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));
  const userId = getLocalStorage.dataUser.id;

  const [getProvincies, setGetProvincies] = useState([]);
  const [getRegencies, setGetRegencies] = useState([]);
  const [getDistricts, setGetDistricts] = useState([]);
  const [getVillages, setGetVillages] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState({});
  const [selectedRegency, setSelectedRegency] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [selectedVillage, setSelectedVillage] = useState({});
  const [address, setAddress] = useState("");
  const [values, setValues] = useState({
    provincies: "",
    regencies: "",
    districts: "",
    villages: "",
    address: "",
    userId: userId,
  });

  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  const redirect = useNavigate();

  useEffect(() => {
    axios
      .get("https://project-ii-server.vercel.app/provincies")
      .then((res) => {
        setGetProvincies(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (selectedProvince.id) {
      axios
        .get(
          `https://project-ii-server.vercel.app/regencies/${selectedProvince.id}`
        )
        .then((res) => {
          setGetRegencies(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedProvince.id]);

  useEffect(() => {
    if (selectedRegency.id) {
      axios
        .get(
          `https://project-ii-server.vercel.app/districts/${selectedRegency.id}`
        )
        .then((res) => {
          setGetDistricts(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedRegency.id]);

  useEffect(() => {
    if (selectedDistrict.id) {
      axios
        .get(
          `https://project-ii-server.vercel.app/villages/${selectedDistrict.id}`
        )
        .then((res) => {
          setGetVillages(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedDistrict.id]);

  const handleProvinceChange = (event) => {
    const selectedProvinceValue = event.target.value;
    const selectedProvinceObject = getProvincies.find(
      (province) => province.id === selectedProvinceValue
    );

    setSelectedProvince(selectedProvinceObject);
    setValues((prevValues) => ({
      ...prevValues,
      provincies: selectedProvinceObject.name,
    }));
  };

  const handleRegencyChange = (event) => {
    const selectedRegencyValue = event.target.value;
    const selectedRegencyObject = getRegencies.find(
      (regency) => regency.id === selectedRegencyValue
    );

    setSelectedRegency(selectedRegencyObject);
    setValues((prevValues) => ({
      ...prevValues,
      regencies: selectedRegencyObject.name,
    }));
  };

  const handleDistrictChange = (event) => {
    const selectedDistrictValue = event.target.value;
    const selectedDistrictObject = getDistricts.find(
      (district) => district.id === selectedDistrictValue
    );

    setSelectedDistrict(selectedDistrictObject);
    setValues((prevValues) => ({
      ...prevValues,
      districts: selectedDistrictObject.name,
    }));
  };

  const handleVillageChange = (event) => {
    const selectedVillageValue = event.target.value;
    const selectedVillageObject = getVillages.find(
      (village) => village.id === selectedVillageValue
    );

    setSelectedVillage(selectedVillageObject);
    setValues((prevValues) => ({
      ...prevValues,
      villages: selectedVillageObject.name,
    }));
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
    setValues((prevValues) => ({ ...prevValues, address: event.target.value }));
  };

  const handleSubmit = () => {
    axios
      .post(
        "https://project-ii-server.vercel.app/insert-address",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);

        redirect("/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Layout>
        <h1>Hello World!</h1>
        <div className="address">
          <select
            className="address-select-provincies"
            name="provincies"
            id="provincies"
            value={selectedProvince.id}
            onChange={handleProvinceChange}
          >
            <option value="" disabled selected>
              Select Provincies
            </option>
            {getProvincies.map((provinces) => (
              <option key={provinces.id} value={provinces.id}>
                {provinces.name}
              </option>
            ))}
          </select>
          <select
            className="address-select-regencies"
            name="regencies"
            id="regencies"
            value={selectedRegency.id}
            onChange={handleRegencyChange}
          >
            <option value="" disabled selected>
              Select Regencies
            </option>
            {getRegencies.map((regencies) => (
              <option key={regencies.id} value={regencies.id}>
                {regencies.name}
              </option>
            ))}
          </select>
          <select
            className="address-select-districts"
            name="districts"
            id="districts"
            value={selectedDistrict.id}
            onChange={handleDistrictChange}
          >
            <option value="" disabled selected>
              Select Districts
            </option>
            {getDistricts.map((districts) => (
              <option key={districts.id} value={districts.id}>
                {districts.name}
              </option>
            ))}
          </select>
          <select
            className="address-select-villages"
            name="villages"
            id="villages"
            value={selectedVillage.id}
            onChange={handleVillageChange}
          >
            <option value="" disabled selected>
              Select Villages
            </option>
            {getVillages.map((villages) => (
              <option key={villages.id} value={villages.id}>
                {villages.name}
              </option>
            ))}
          </select>
          <textarea
            className="address-textarea"
            name="address"
            id="address"
            cols="30"
            rows="10"
            value={address}
            onChange={handleAddressChange}
          ></textarea>
          <button
            className="address-button"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </Layout>
    </>
  );
}
