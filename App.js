import './App.css';
import React from 'react'
import { useState, useEffect,Fragment } from 'react';
import axios from 'axios'

function App() {
  {/*url to adopt the host*/}
  const api_url='http://localhost'
  const initialState = {
        start_date:"",
        retun_date:null,
        deperture_from:"",
        arrival_from:"",
        two_way:false,
        by_price:false,
        page:1,
        airlines: [],
        airports: [],
        arrival_airports: [],
        trips: [],
        error_message: "",
        flag:true,
        curent_pagi:"",
        count_pagi:[],
    }

    {/* bind state wiht return date*/}
    const returnFunc = (e) => {

            setdata({
                ...data,
               two_way: e.target.checked

            });

    }

    {/* calling api for trip search*/}
    const searchflight=(e)=>{
        e.preventDefault();
        if(data.start_date==="" || data.deperture_from==="" || data.arrival_from==="" ){
          alert("Please Check Dates, Arrivals and Destination")
          return 0;
        }

          getTrips();

    }

    {/* reusable call function for trip*/}
    const getTrips=()=>{
      axios.get(api_url+'/api/tripbuild?start_date='+data.start_date+'&retun_date='+data.retun_date+'&deperture_from='+data.deperture_from+'&arrival_from='+data.arrival_from+'&two_way='+data.two_way+'&by_price='+data.by_price+'&page='+data.page).then((res) => {
          console.log(res)
          setdata({
              ...data,
             trips: res.data.data,
             curent_pagi: res.current_page,
             count_pagi: res.data.links,
              // [e.target.name+'HelperText']: '',
              // [e.target.name+'Error']: false,
          });
      }).catch((err) => {
          console.log(err.response)
          alert(err.response.data.message)
      });
    }
    const setArrival=(e)=>{
      setdata({
          ...data,
         arrival_from: e.target.value

      });

    }

    {/* converting dates to larvel api friendly for timezone check*/}
    const startDate=(e)=>{
      let d = new Date(e.target.value);
      let month = '-' + (d.getMonth() + 1);
      let day = d.getDate();
      let year = '-' +d.getFullYear();
      let date1 = day+month+year;
      console.log(date1)
      setdata({
          ...data,
         start_date: date1

      });

    }
    {/* converting dates to larvel api friendly for timezone check*/}
    const endDate=(e)=>{
      let d = new Date(e.target.value);
      let month = '-' + (d.getMonth() + 1);
      let day = d.getDate();
      let year = '-' +d.getFullYear();
      let date1 = day+month+year;
      console.log(date1)
      setdata({
          ...data,
         retun_date: date1

      });

    }
    const priceSort = (e) => {

            setdata({
                ...data,
               by_price: e.target.checked

            });

    }
    const pagina = (e) => {
            e.preventDefault()
            let key = e.target.dataset.key
            key = parseInt(key)
            console.log(key);
            setdata({
                ...data,
               page: key,

            });
            axios.get(api_url+'/api/tripbuild?start_date='+data.start_date+'&retun_date='+data.retun_date+'&deperture_from='+data.deperture_from+'&arrival_from='+data.arrival_from+'&two_way='+data.two_way+'&by_price='+data.by_price+'&page='+key).then((res) => {
                console.log(res)
                setdata({
                    ...data,
                   trips: res.data.data,
                   curent_pagi: res.current_page,
                   count_pagi: res.data.links,
                    // [e.target.name+'HelperText']: '',
                    // [e.target.name+'Error']: false,
                });
            }).catch((err) => {
                console.log(err.response)
                alert(err.response.data.message)
            });
    }
    const getAirport = (e) => {
        // e.target.value
        axios.get(api_url+'/api/airports?code='+e.target.value).then((res) => {
            console.log(res)
            setdata({
                ...data,
               arrival_airports: res.data,
               deperture_from:e.target.value
                // [e.target.name+'HelperText']: '',
                // [e.target.name+'Error']: false,
            });
        });
    }
    const [data, setdata]= useState(initialState)

    useEffect(() => {
        async function fetchMyAPI() {
        let response1 = await axios.get(api_url+'/api/airlines')
        let response2 = await axios.get(api_url+'/api/airports')
        // response1 = await response1.json()
        // response2 = await response2.json()
        // // dataSet(response)
        setdata({
                ...data,
               airlines: response1.data,
               airports: response2.data,
                // [e.target.name+'HelperText']: '',
                // [e.target.name+'Error']: false,
            });
      }

      fetchMyAPI()

    },[])


  return (
    <div className="App">
    <div className="col-md-3 filters offset-0">
      <div className="bookfilters hpadding20">
        <form onSubmit={searchflight}>
          <div className="flightstab2 ">
              <div className="wh90percent textleft">
                <span className="opensans size13">Flying from</span>
                <select className="form-control" name="deperture_from" id="deperture_from"  onChange={getAirport}>
                <option value="">Select Airport</option>
                {data.airports.map((airport) =>
                    <option key={airport.code} value={airport.code}>{airport.name}</option>
                )}
                </select>
              </div>
              <div className="wh90percent textleft">
                <span className="opensans size13">To</span>
                <select className="form-control" name="arrival_from" id="arrival_from" onChange={setArrival}>
                <option value="">Select Airport</option>
                {data.arrival_airports.map((airport) =>
                    <option key={airport.code} value={airport.code}>{airport.name}</option>
                )}
                </select>
              </div>
            <div className="clearfix pbottom15"></div>
            <div className="checkbox">
              <label>
                <input type="checkbox" name="two_way" onChange={returnFunc}/>Both Way
              </label>
            </div>

            <div className="clearfix pbottom15"></div>

            <div className="w50percent">
              <div className="wh90percent textleft">
                <span className="opensans size13">Departing</span>
                <input type="date" name="start_date" className="form-control mySelectCalendar" id="" onChange={startDate}/>
              </div>
            </div>

            <div className="w50percentlast">
              <div className="wh90percent textleft right">
                <span className="opensans size13">Returning</span>
                <input disabled={!data.two_way} name="end_date" type="date"  className="form-control mySelectCalendar" id=""  onChange={endDate}/>
              </div>
            </div>
            <div className="clearfix pbottom15"></div>
            <div className="checkbox">
              <label>
                <input type="checkbox" name="price" onChange={priceSort}/>Price Sort
              </label>
            </div>

            <div className="clearfix pbottom15"></div>

            <div className="clearfix pbottom15"></div>
          <div className="clearfix"></div>
            <button type="submit" className="btn-search3">Search</button>
          </div>


      </form>
      </div>
      <div id="collapse4" className="collapse in">
        {data.airlines.map((airline) =>
          <Fragment key={airline.code}>
            <div className="hpadding20">
              <div className="checkbox">
                <label>
                  <input name={airline.code} value={airline.code} type="checkbox" checked/>{airline.name}
                </label>
              </div>
            </div>
            <div className="clearfix"></div>
          </Fragment>
          )}

      </div>


      <div className="line2"></div>
      <div className="clearfix"></div>
      <br/>
      <br/>
      <br/>


    </div>
    <div className="rightcontent col-md-9 offset-0">
          <div className="itemscontainer offset-1">
          <div className="clearfix"></div>
          <br></br>

          {data.trips.map((trip) =>
            <Fragment key={trip.index}>
          <div className="offset-2">

            <div className="col-md-12 offset-0">

              <div className="itemlabel3">
              <h4>Departure Flight Details</h4>
              <b>Flight Number:</b> {trip.one.airline}{trip.one.number}
              <b>Airport:</b> {trip.one.departure_airport}
              <b>Departure Time:</b> {trip.one.departure_time}
              <b>Arrival Airport:</b> {trip.one.arrival_airport}
              <b>Arrival Time:</b> {trip.one.arrival_time}
              <b>Price:</b> {trip.one.price}

              <h4 hidden={!trip.round}>Arrival Flight Details</h4>
              <p hidden={!trip.round}>
              <b >Flight Number:</b> {trip.round == true?  trip.two.airline + trip.two.number  : ' '}
              <b>Airport:</b> {trip.round == true?  trip.two.departure_airport  : ' '}
              <b>Departure Time:</b> {trip.round == true?  trip.two.departure_time  : ' '}
              <b>Arrival Airport:</b> {trip.round == true?  trip.two.arrival_airport  : ' '}
              <b>Arrival Time:</b> {trip.round == true?  trip.two.arrival_time  : ' '}
              <b>Price:</b> {trip.round == true?  trip.two.price  : ' '}</p>
                <div className="labelright">

                  <span className="green size18"><b>{trip.total}</b></span><br/>

                   <button className="bookbtn mt1" type="submit">Details</button>

                </div>
            </div>
          </div>
      </div>
      <div className="clearfix"></div>
      <br></br><hr></hr>
      </Fragment>)}
      <div className="hpadding20">

        <ul className="pagination right paddingbtm20">
          {data.count_pagi.map((pagi,index) =>

          <li hidden={index!=0} key={index}><b data-key={index} onClick={pagina}>{index}</b></li>)}
        </ul>

      </div>
  </div>
    </div>
    </div>
  );
}

export default App;
