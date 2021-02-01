import React, {useState, useEffect} from 'react';
import { Button,Input,FormControl,InputLabel,Container,Box,TextField} from '@material-ui/core';
import { gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import Client from "../utils"



function UserPanel() {
    const [users, setUsers] = useState([])
    const [nameFilt, setNameFilt] = useState("")
    const [timeO,setTimeO]=useState(0)
    const [showM,setShowM]=useState(false)
    const [orderSet,setOrderSet]=useState({orderBy:"",order:""})

    // Simulated props for the purpose of the example
    const Styles = { backgroundColor: '#ffffff'}
    // Pass the props as the first argument of useStyles()
    const classes = useStyles(Styles)


    const GetUsers = (event,name) =>{
        const GET_USER = gql`
            query getUsers($orderBy:String!,$order:String!,$name:String!){
                getUsers(orderBy:$orderBy,order:$order,name:$name)
            }
        `
        const result  = Client.query({
            query:GET_USER,
            variables:{orderBy:event?event.orderBy:"",order:event?event.order:"",name:name?name:""}
        }).then(result=> {
            if(result.error){
                console.log(`there is this error ${result.error}`)
            }else{
                let users = JSON.parse(result.data.getUsers)
                if(users)setUsers(users)
            }
        })
    }
    const createUser = (object)=>{
        const CREATE_USER = gql`
        mutation createUsers($inputUser:UserInput){
            createUser(inputUser:$inputUser)
        }
        `
        const result  = Client.mutate({
            mutation:CREATE_USER,
            variables:{inputUser:{...object}}
        }).then(result=> {
            if(result.error){
                console.log(`there is this error ${result.error}`)
            }else{
                window.location.reload()
            }
        })
    }

    const editUser = (object)=>{
        const EDIT_USER = gql`
        mutation editUsers($inputUser:UserInput){
            editUser(inputUser:$inputUser)
        }
        `
        const result  = Client.mutate({
            mutation:EDIT_USER,
            variables:{inputUser:{...object}}
        }).then(result=> {
            if(result.error){
                console.log(`there is this error ${result.error}`)
            }else{
                window.location.reload()
            }
        })
    }

    const deleteUser = (id)=>{
        const DELETE_USER = gql`
        mutation deleteUsers($id:String!){
            deleteUser(id:$id)
        }
        `
        const result  = Client.mutate({
            mutation:DELETE_USER,
            variables:{id:id}
        }).then(result=> {
            if(result.error){
                console.log(`there is this error ${result.error}`)
            }else{
                window.location.reload()
            }
        })
    }

    const handleOrder=event=>{
        setOrderSet(event)
        GetUsers(event,nameFilt)
    }
    const nameSearch = event =>{
        setNameFilt(event.target.value)
        if(timeO){
            clearTimeout(timeO)
        }
        setTimeO(setTimeout(()=>{GetUsers(orderSet,event.target.value)},1000))
    }
    

    useEffect(()=>{
        GetUsers()
    },[])

    return (
        <Container maxWidth="lg" >
            <Box width='100%'>
                <form >
                    <TextField id="outlined-basoc" label="Outlined"  value={nameFilt} classes={{root:classes.InputLabel}} variant="outlined" onChange={nameSearch}/>
                </form>


                <Box className={classes.dataGrid} width="100%">
                    <div className="row-header">
                        <div className='row-name'> 
                            {`Name \n (job title)`} <OrderControls makeCall={handleOrder} orderBy="name"/>
                        </div>
                        <div className='row-age'>
                            age <OrderControls makeCall={handleOrder} orderBy="age"/>
                        </div>
                        <div className='row-userName'>
                            Username <OrderControls makeCall={handleOrder} orderBy="username"/>
                        </div>
                        <div className='row-hireDate'>
                            Hire Date <OrderControls makeCall={handleOrder} orderBy="hireDate"/>
                        </div>
                        <div className='row-controls'>
                            
                        </div>
                    </div>
                    <div className="row-element">

                    </div>
                    {users.map(user=>{
                        return (<div  className="row-element" key={user.id}>
                            <div className='row-name'> 
                                {user.name.split('\n').map((line,index)=><React.Fragment key={user.id+index}>{line}<br/></React.Fragment>)}
                            </div>
                            <div className='row-age'>
                                {user.age}
                            </div>
                            <div className='row-userName'>
                                {user.username}
                            </div>
                            <div className='row-hireDate'>
                                {user.hireDate}
                            </div>
                            <div className='row-controls'>
                                <ControlButtons elementId={user} closeModal={setShowM} classes={classes.userModal} deleteTrigger={deleteUser} editTrigger={editUser}/>
                            </div>
                            </div>)
                    })}
                </Box>
                <Button variant="outlined" classes={{root:classes.buttonElement}} onClick={()=>setShowM(true)}> Add new employee</Button>
            </Box>
            {showM && (
                    <UserModal classes={classes.userModal} type="newUser" closeModal={setShowM} eventTrigger={createUser}/>
            )}
        </Container>
    ) 
}

const useStyles = makeStyles({
        basicForm: {
            "& .MuiBox-root":{
                boxSizing:"border-box"
            },
            backgroundColor:'#ffffff'
        },
        InputLabel:{
            "& *":{
                color:"white",
                borderColor:"white",
            }
        },
        buttonElement:{
            color:"white",
            border:"1px solid white",
            "&:hover":{
                border:"2px solid white"
            }
        },
        userModal:{
            position:"absolute",
            backgroundColor:"#ffffffe3",
            top:"0",
            left:"0",
            width:"100%",
            height:"100%",
            zIndex:"1",
            "& .user-view":{
                maxWidth:"500px",
                margin:"auto",
                marginTop:"30vh",
                backgroundColor:"#fff",
                padding:"20px 20px 40px 20px",
                "& button":{
                    marginLeft:"16px",
                    marginTop:"16px"
                },
                "& p":{
                    color:"black"
                }
            }
        },
        dataGrid:{
            margin:"20px 0",
            fontSize:"18px",
            color:"white",
            border:"1px solid",
            '& .row-header,.row-element':{
                display:"flex",
                borderBottom:"1px solid",
                '& .row-age':{
                    width:"10%"
                },
                '& .row-name':{
                    width:"35%"
                },
                '& .row-userName':{
                    width:"20%"
                },
                '& .row-hireDate':{
                    width:"20%"
                },
                '& .row-controls':{
                    width:"15%"
                },
                "& .row-age,.row-name,.row-userName,.row-hireDate":{
                    borderRight:"1px solid"
                }

            }
        }
    });


function ControlButtons (props){
    const [showM,setShowM]=useState(false)
    const [typeE,setTypeE]=useState("")
    const [triggerE,setTriggerE]=useState({})

    const handleEdit = event =>{
        event.preventDefault()
        setTypeE("editUser")
        setShowM("true")
    }
    const handleView = event =>{
        event.preventDefault()
        setTypeE("viewUser")
        setShowM("true")
    }
    const handleDelete = event =>{
        event.preventDefault()
        setTypeE("deleteUSer")
        setShowM("true")
    }



    return (
    <React.Fragment>
        <a href="." style={{color:"inherit"}} onClick={handleEdit} ><EditIcon/> </a>
        <a href="." style={{color:"inherit"}} onClick={handleView} ><VisibilityIcon/></a>
        <a href="." style={{color:"inherit"}} onClick={handleDelete} ><DeleteIcon/></a>
        {showM && (
                    <UserModal classes={props.classes} type={typeE} userVariables={props.elementId} closeModal={setShowM} eventTrigger={typeE=="deleteUSer"?props.deleteTrigger:props.editTrigger} />
            )}
    </React.Fragment>)
}

function OrderControls (props){
    const [order, setOrder] = useState(false);
    
    const handleClick = event=>{
        event.preventDefault()
        props.makeCall({orderBy:props.orderBy,order:order?"up":"down"})
        setOrder(!order)
    }
    return (
    <React.Fragment>
        <a href="." style={{color:"inherit"}} onClick={handleClick}>{order?<ArrowDropDownIcon/>:<ArrowDropUpIcon/>}</a>
    </React.Fragment>)
}

function UserModal(props){

    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [username, setUsername] = useState("")
    const [hireDay, setHireDay] = useState("")
    const [hireMonth, setHireMonth] = useState("")
    const [hireYear, setHireYear] = useState("")

    const onchange=event=>{
        switch (event.target.name) {
            case 'name':
                setName(event.target.value)
                break;
            case 'age':
                setAge(event.target.value)
                break;
            case 'username':
                setUsername(event.target.value)
                break;
            case 'hireDay':
                setHireDay(event.target.value)
                break;
            case 'hireMonth':
                setHireMonth(event.target.value)
                break;
            case 'hireYear':
                setHireYear(event.target.value)
                break;
        
            default:
                break;
        }
    }
    const handleSubmit = event=>{
        event.preventDefault()
        let objectId = props.userVariables&&props.userVariables.id?props.userVariables.id:"id"+new Date().getTime()
        const user ={
            id:objectId,
            "name":name,
            "age":age,
            "username":username,
            "hireDate": `${hireDay}/${hireMonth}/${hireYear}`
        }
        props.eventTrigger(user)
        props.closeModal(false)
    }
    const handleDelete = event=>{
        event.preventDefault()
        props.eventTrigger(props.userVariables.id)
        props.closeModal(false)
    }

    useEffect(()=>{
        if(props.userVariables){
            setName(props.userVariables.name)
            setAge(props.userVariables.age)
            setUsername(props.userVariables.username)
            let hireDate = props.userVariables.hireDate.split("/")
            setHireDay(hireDate[0])
            setHireMonth(hireDate[1])
            setHireYear(hireDate[2])
        }
    },[])

    const closeModal= event =>{
        event.preventDefault()
        props.closeModal(false)
    }

    if(props.type&&props.type=="deleteUSer"){
        return(
            <div className={props.classes}>
                <form className="user-view" onSubmit={handleDelete}>
                    <p>Are you sure you want to delete this Eployee ?</p>
                    <Button variant="outlined" type="submit"> Delete Employee</Button>
                    <Button variant="outlined" onClick={closeModal}> Close</Button>
                </form>
            </div>
        )
    }

    return (
        <div className={props.classes}>
            <form className="user-view" onSubmit={handleSubmit}>
                <Box  px={2}>
                    <FormControl fullWidth={true} > 
                        <InputLabel htmlFor="Name">Name</InputLabel>
                        <Input id="Name" aria-describedby="name-input" name="name" value={name} onChange={onchange} disabled={props.type&&props.type=="viewUser"}/>
                    </FormControl>
                </Box>
                <Box  px={2}>
                    <FormControl fullWidth={true} > 
                        <InputLabel htmlFor="Age">Age</InputLabel>
                        <Input id="Age" aria-describedby="age-input" name="age" value={age} onChange={onchange}disabled={props.type&&props.type=="viewUser"}/>
                    </FormControl>
                </Box>
                <Box  px={2}>
                    <FormControl fullWidth={true} > 
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" aria-describedby="username-input" name="username"onChange={onchange} value={username}disabled={props.type&&props.type=="viewUser"}/>
                    </FormControl>
                </Box>
                <Box  px={2}>
                    <FormControl fullWidth={false} > 
                        <InputLabel htmlFor="hireDay">Hire Day</InputLabel>
                        <Input id="hireDay" aria-describedby="hireDay-input" name="hireDay"onChange={onchange} value={hireDay}disabled={props.type&&props.type=="viewUser"}/>
                    </FormControl>
                    <FormControl fullWidth={false} > 
                        <InputLabel htmlFor="hireMonth">Hire Month</InputLabel>
                        <Input id="hireMonth" aria-describedby="hireMonth-input" name="hireMonth"onChange={onchange} value={hireMonth}disabled={props.type&&props.type=="viewUser"}/>
                    </FormControl>
                    <FormControl fullWidth={false} > 
                        <InputLabel htmlFor="hireYear">Hire Year</InputLabel>
                        <Input id="hireYear" aria-describedby="hireYear-input" name="hireYear" onChange={onchange}value={hireYear}disabled={props.type&&props.type=="viewUser"}/>
                    </FormControl>
                </Box>
                {props.type&&props.type=="newUser"&&(
                    <Button variant="outlined" type="submit"> Add new employee</Button>
                )}
                {props.type&&props.type=="editUser"&&(
                    <Button variant="outlined" type="submit"> Edit employee</Button>
                )}
                <Button variant="outlined" onClick={closeModal}> Close</Button>
            </form>
        </div>
    )
}

export default UserPanel