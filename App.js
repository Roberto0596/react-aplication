import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import SelectInput from 'react-native-select-input-ios';

export default class App extends React.Component
{ 
  constructor(props)
  {
    super(props);
    this.state = {
      loading: true,
      tableHead: [],
      tableData: [],
      options: [{ value: "mexico", label: 'Mexico'},
                {value: "italy", label: "Italia"},
                {value: "Spain", label: "España"}]
    }
  }

  componentDidMount()
  {
    this.load("mexico");
  }

  changeCountry(value)
  {
    this.load(value);
  }

  load(pais)
  {
      return axios({
        "method":"GET",
        "url":"https://covid-19-data.p.rapidapi.com/country",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"covid-19-data.p.rapidapi.com",
        "x-rapidapi-key":"e36277b228msh7650bcd4f87129dp18296ajsn2c9a98a8b9d1",
        "useQueryString":true
      },"params":{
        "format":"json",
        "name":pais,
      }
    })
    .then((response)=>{
      let res = response["data"][0];
      let array = [res["code"],res["country"],res["confirmed"],res["recovered"],res["deaths"]];
      this.setState({
        loading:false,
        tableHead: ['codigo','pais','confirmados','recuperados','muertos'],
        tableData: [
          array
        ]
      })
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  render()
  { 
    if(this.state.loading == false)
    {
      const state = this.state;
      return (
        <View style={styles.container}>
           <SelectInput style={{margin:50}} value={0} options={state.options} onSubmitEditing={this.changeCountry.bind(this)} />
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff',width: 200}}>
            <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
            <Rows data={state.tableData} textStyle={styles.text}/> 
          </Table>

          <Text style={{ color:"#fff" }}>Selecciona un pais</Text>
        </View>
        );
    }
    else
    {
      return (
        <ActivityIndicator></ActivityIndicator>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#57e073' },
  head: { height: 40, backgroundColor: '#b7cff8', color: '#fff' },
  text: { margin: 6 }
});

