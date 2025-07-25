
import { configureStore, createSlice } from '@reduxjs/toolkit';


const myslice=createSlice({
    name:"myslice",
    initialState:{
        userDetails:{},
        employeedetails:[],
        setprofiledata:{},
        empid:"",
        expenseData:{},
        employeeFullDetails:{},
        newItem:{},
        pic:""
    },
    reducers:{
        senddetails(store,action){
            
            
            
            store.userDetails=action.payload
            
        },
        employeeDetails(store,action){
            
            store.employeedetails=action.payload
        },
        profiledetails(store,action){
            
            store.setprofiledata=action.payload
            
        },
        sendempid(store,action){
            
            store.empid=action.payload
            
        },
          sendExpenseData(store,action){
            
            store.expenseData=action.payload
            
        },
        sendempDetails(store,action){
            store.employeeFullDetails=action.payload
        },
        sendempDetails1(store,action){
            store.employeedetails=action.payload
        },
        sendNewItem(store,action){
            store.newItem=action.payload
        },
        sendpic(store,action){
            store.pic=action.payload
            console.log("mydatapic",pic);
            
        }
       
    }
})

export const myreducers=myslice.actions


const Store=configureStore(myslice)
export default Store