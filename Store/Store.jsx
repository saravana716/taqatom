
import { configureStore, createSlice } from '@reduxjs/toolkit';


const myslice=createSlice({
    name:"myslice",
    initialState:{
        userDetails:{},
        employeedetails:[],
        setprofiledata:{},
        empid:""
    },
    reducers:{
        senddetails(store,action){
            console.log("oooooooooooooooooooooooooooooooooooo");
            
            console.log("actiontye",action);
            store.userDetails=action.payload
            
        },
        employeeDetails(store,action){
            console.log("action",action);
            store.employeedetails=action.payload
        },
        profiledetails(store,action){
            console.log("myaction",action);
            store.setprofiledata=action.payload
            
        },
        sendempid(store,action){
            console.log(action);
            store.empid=action.payload
            
        }
    }
})

export const myreducers=myslice.actions


const Store=configureStore(myslice)
export default Store