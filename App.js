import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';

const rawdata = [
  {place: "B1", left: -1, full: 407},
  {place: "C1", left: -1, full: 476},
  {place: "C2", left: -1, full: 80},
  {place: "D1", left: -1, full: 309}
];

function _getValue(data){
  fetch("http://u-campus.ajou.ac.kr/ltms/mobile/lst.mobile")
    .then(function(response) {
      response.text().then(function(text) {
        var result = text;

        var split = result.split('roomStatus');
        var b1 = split[1].split('<p> 공석 / 전체좌석 : <span>')[1].split(' /')[0];
        //console.log(b1);
        var c1 = split[2].split('<p> 공석 / 전체좌석 : <span>')[1].split(' /')[0];
        //console.log(c1);
        var c2 = split[3].split('<p> 공석 / 전체좌석 : <span>')[1].split(' /')[0];
        //console.log(c2);
        var d1 = split[4].split('<p> 공석 / 전체좌석 : <span>')[1].split(' /')[0];
        //console.log(d1);
        data[0].left=b1;
        data[1].left=c1;
        data[2].left=c2;
        data[3].left=d1;
        //console.log(data);
      })
    })
    .catch((error) => {
      console.error(error);
    });
  return true;
}

const sleep = (milliseconds) => {
 return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default class App extends Component{

  constructor(props) {
   super(props);
   this.state = {
     loaded: false,
     date: '',
     page: 1,
     refreshing: false
   };
  }


  _setstate = ()=>{
    this.setState({refreshing: true, page: this.state.page+1});
    _getValue(rawdata);
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    that.setState({
      date:
        year + "년 " + month + "월 " + date + "일 "+hours+"시 "+min+"분 "+ sec +"초",
    });
    //console.log(this.state.date);
    sleep(1000).then(() => {
      this.setState({refreshing: false});
    });

  }

  componentDidMount() {
   var that = this;
   var date = new Date().getDate(); //Current Date
   var month = new Date().getMonth() + 1; //Current Month
   var year = new Date().getFullYear(); //Current Year
   var hours = new Date().getHours(); //Current Hours
   var min = new Date().getMinutes(); //Current Minutes
   var sec = new Date().getSeconds(); //Current Seconds
   that.setState({
     date:
       year + "년 " + month + "월 " + date + "일 "+hours+"시 "+min+"분 "+ sec +"초",
   });
   _getValue(rawdata);
   sleep(1000).then(()=>{
     that.setState({loaded: true});
     this.forceUpdate();
   })
 }



 _renderitem = ({item}) => {
   var rate = (1-item.left/item.full)*100;
   return(
    <View style={styles.items}>
      <Text style={styles.item_title}>{item.place} 열람실</Text>
      <Text style={styles.item_contents}>공석/전체 : {item.left}/{item.full}</Text>
      <Text style={styles.item_contents}>사용율 : {rate.toFixed(2)}%</Text>
    </View>
   )
 }



  render(){
    const loaded = this.state.loaded;
    //console.log("loaded"+loaded);
    return (
        <View style={styles.container}>
          { loaded? (
            <View style={styles.upper}>
              <Text style={styles.title}>아주대 중앙도서관 열람실 현황</Text>
              <Text style={styles.time} refreshing={this.state.refreshing}>{this.state.date}</Text>

              <FlatList style={styles.flatList}
                data={rawdata}
                refreshing={this.state.refreshing}
                onRefresh={this._setstate}
                renderItem={this._renderitem}/>
            </View>
          ):(
            <View style={styles.lower}>
              <Text style={styles.title}>로딩중...</Text>
            </View>
          )}

          <View style={styles.lower}>
            <Text style={styles.scroll}>scroll down to update</Text>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B4E8E',
  },
  upper: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  lower: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 100,
    marginBottom: 10,
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginLeft: 15
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#F7A30A",
    marginLeft: 15,
    marginBottom: 10
  },
  flatList: {
    flexGrow: 0,
    marginTop: 10,
  },
  items: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  item_title:{
    fontSize: 20,
    color: "#2294ED",
    fontWeight: 'bold',
    marginBottom: 5
  },
  item_contents: {
    marginTop: 5,
    fontSize: 18,
  },
  scroll: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  }

});
