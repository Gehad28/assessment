import { useEffect, useState } from "react";
import "./App.css";
function App() {
  // use data to display the fetched transactions
  const [data, setData] = useState([]);
  const [val, setVal] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('customer_id');
  const [customer_id, setCustomerID] = useState(0);
  const [item_id, setItemID] = useState(0);
  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date());

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/");
    const fetchedData = await response.json();
    setData(fetchedData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  }

  const handleCustomerInputCahnge = (event) => {
    setCustomerID(event.target.value);
  }

  const handleItemInputCahnge = (event) => {
    setItemID(event.target.value);
  }

  const handleStartDateInputCahnge = (event) => {
    setStartDate(event.target.value);
  }

  const handleEndDateInputCahnge = (event) => {
    setEndDate(event.target.value);
  }

  const handleFilterBtn = async  () => {
    const params = {
      group_by: selectedFilter,
    };
    const body = {};
    if (selectedFilter === "customer_id") {
      body.customer_id = customer_id;
    }
    else if (selectedFilter === "item_id") {
      body.item_id = item_id;
    }
    else if (selectedFilter === "date_range") {
      body.date_range = { start_date, end_date };
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`http://127.0.0.1:5000/filter?${queryString}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body)
    });
    const fetchedData = await response.json();
    setData(fetchedData.transactions);
    setVal(fetchedData.val);
  }

  const handleRemoveFilter = () => {
    fetchData();
    setVal({});
  }

  return (
    <div>
      <h1>Welcome to UR-Store Assessment</h1>
      {/* implement the ui here */}
      <div className="filter">
        <label htmlFor="filter">Filter By</label>
        <select name="filter" value={selectedFilter} onChange={handleFilterChange}>
          <option value="customer_id">Customer ID</option>
          <option value="item_id">Item ID</option>
          <option value="date_range">Date Range</option>
        </select>
        {selectedFilter === "customer_id" && <input name="customer_id" type="text" placeholder="Customer ID" onChange={handleCustomerInputCahnge}></input>}
        {selectedFilter === "item_id" && <input name="item_id" type="text" placeholder="Item ID" onChange={handleItemInputCahnge}></input>}
        {selectedFilter === "date_range" && 
        <div className="date-range">
          <input name="start_date" type="date" placeholder="Start Date" onChange={handleStartDateInputCahnge}></input>
          <input name="end_date" type="date" placeholder="End Date" onChange={handleEndDateInputCahnge}></input>
        </div>
        }
        <button onClick={handleFilterBtn}>Filter</button>
        <button onClick={handleRemoveFilter}>Remove Filter</button>
      </div>

      <ul className="transactions">
        <li className="head">
          <span>transaction_id</span>
          <span>customer_id</span>
          <span>date</span>
          <span className="items-head">
            <span>item_id</span>
            <span>name</span>
            <span>price</span>
            <span>quantity</span>
          </span>
          <span>total_amount</span>
        </li>

        {data.map((transaction, index) => (
          <li key={index}>
            <span>{transaction.transaction_id}</span>
            <span>{transaction.customer_id}</span>
            <span>{transaction.date}</span>
            <ul className="items_list">
              {transaction.items.map((item, index) => (
                <li key={index}>
                  <span>{item.item_id}</span>
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                  <span>{item.quantity}</span>
                </li>
              ))}
            </ul>
            <span>{transaction.total_amount}</span>
          </li>
        ))}
          {
            (val.quantity || val.total_amount) && 
              <li className="head">
                <span></span>
                <span></span>
                <span></span>
                <span className="items-head">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span>{val.quantity}</span>
                </span>
                <span>{val.total_amount}</span>
              </li>
          }
      </ul>

    </div>
  );
}

export default App;
