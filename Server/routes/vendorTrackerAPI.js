const express = require("express");
const  moment = require('moment');
const request =require("request");
const date = require('date-and-time')
const cors = require('cors');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
var fs = require('fs');
var currentDate  =  new Date();
const apiURL = "http://192.168.1.24:9000/api/all_user_list/"
const fileURL = "http://192.168.1.24";
// const multer = require('multer');
const myConn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"fidel@123",
    database:"vendor_tracker",
    multipleStatements:true,
  });
 
  myConn.connect(function(err){
    if(err)
    {
     throw err;
      console.log('error');
    }  else
    {
        console.log('success');
    }
  });
 
// -------------------------------Request----------------------------------------
//--------------------------------------------------------------------------------
 
router.use(cors());

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'upload')
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

// const upload = multer({storage}).array('file');

router.post('/uploadRequestFile', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.files)
    })
});
 
// download Request file
router.post("/requestFile",(req,res) => {
    let requestID = req.body.requestID;
    myConn.query("select * from request where id = ?",[requestID],(err,rows,fields) => {
        if(!err)
        {
            res.download("./"+rows[0]['path']);
        } else
        {   
            console.log(err);
        }    
})
})

// get all requests 
router.get("/requests",(req,res,next) => {
    myConn.query("SELECT * FROM  request order by id desc",(err,rows,fields) => {
        if(!err)
        {          
               
           
            for (let i = 0; i < rows.length; i++) { 
                if(rows[i]['status'] === '1' &&  rows[i]['doc_vmpm'] !== null)
                {
                   
                    let doc_vmpm = date.format(rows[i]['doc_vmpm'],'YYYY-MM-DD HH:mm:ss');
                    let doc = date.format(rows[i]['date_of_closure'],'YYYY-MM-DD HH:mm:ss');
                    if(doc < doc_vmpm && rows[i]['status'] === '1')
                    {
                        rows[i]['color'] = 'red'                  
                        
                    } else if (doc > doc_vmpm && rows[i]['status'] === '1')
                    {
                        rows[i]['color'] = 'green'
                        
                    }  
                } else
                {
                    
                    if(rows[i]['status'] === '2')
                    {
                        rows[i]['color'] = 'Blue'
                    } else if (rows[i]['status'] === '3')
                    {
                        rows[i]['color'] = 'black'
                    } else if (rows[i]['status'] === '4')
                    {
                        rows[i]['color'] = 'grey'
                    }
                }

                if(rows[i]['doc_vmpm'] === null)
                {
                    rows[i]['doc_vmpm'] = ''; 
                } else
                {
                    rows[i]['doc_vmpm'] =  moment(rows[i]['doc_vmpm']).format("DD-MM-YYYY hh:mm a");
                }
                
            }
            
            res.send(rows); 

        } else
        {
            console.log(err);
        }
      
    })
})
 
// get single request
router.get("/request/:id",(req,res) => {
    var requestid = req.params.id;
    myConn.query("SELECT * FROM request where id = ?",[requestid],(err,rows,fields) => {
        if(!err)
        {
            res.send(rows[0]);
        } else
        {
            console.log(err);
        }
    })
})

// insert request 
router.post("/requestInsert",(req,res) =>{
    let dateOfRequest = req.body.dor_time;
    let requestFrom = req.body.request_from;
    let coOrdinator = req.body.co_ordinator;
    let sourceLanguage = req.body.source_language;
    let tagetLanguage = req.body.target_language;
    let serviceType = req.body.service_type;
    let particulars = req.body.particulars;
    let responseBy = req.body.response_by;
    let status = req.body.status;
    let eCode = req.body.eCode;
    let createdBy = req.body.createdBy;
    let closureDate = req.body.date_of_closure;
    let strTargetLanguage =  tagetLanguage.toString();
    let strSourceLanguage =  sourceLanguage.toString();
    let strServiceType =  serviceType.toString();
      myConn.query("INSERT INTO request(dor_time, request_from, e_code, co_ordinator,source_language, target_language, service_type, particulars,  status,created_by,date_of_closure) values (?,?,?,?,?,?,?,?,?,?,?)",[dateOfRequest,requestFrom,eCode,coOrdinator,strSourceLanguage,strTargetLanguage,strServiceType,particulars,status,createdBy,closureDate],(err,result) => {
       if(!err)
        {
            myConn.query("INSERT into notification_log(request_id,user_id,flag,date_entered) values (?,?,?,?)",[result.insertId,createdBy,'unread',currentDate])
            res.json({
                status:200,
                message:"Request has been inserted successfully"
            });  
            
        } else
        {
            console.log(err);
        }

     });

})



 

// delete request
router.delete("/requestDelete/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("DELETE  FROM response where request_id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            myConn.query("DELETE  FROM request where id =?",[deleteID],(err,rows,fields) => {
            if(!err)
            {
                myConn.query("DELETE  FROM notification_log where request_id =?",[deleteID],(err,rows,fields) => {
                if(!err)
                {
                    myConn.query("DELETE  FROM comment_notification_log where request_id =?",[deleteID],(err,rows,fields) => {
                        if(!err)
                        {
                            res.json({
                                status:1,
                                message:"Request has been deleted successfully"
                            }); 
                        }
                    });
                }    

                });
            }    
           
        });       
        } else
        {
            console.log(err);
        }
    })
})

// update request
router.put("/requestUpdate/:id",(req,res)=>{
    let dateOfRequest = req.body.dor_time;
    let requestFrom = req.body.request_from;
    let eCode = req.body.e_code;
    let coOrdinator = req.body.co_ordinator;
    let sourceLanguage = req.body.source_language;
    let tagetLanguage = req.body.target_language;
    let serviceType = req.body.service_type;
    let particulars = req.body.particulars;
    let status = req.body.status;    
    let id = req.params.id;
    let doc = req.body.date_of_closure;
    let doc_vmpm = req.body.doc_vmpm;
    let userRole = req.body.userRole;
    let query;
    let parameter;
    let filename = req.body.filename;
    let mimetype = req.body.mimetype;
    let path = req.body.path;
    let strTargetLanguage =  tagetLanguage.toString();
    let strSourceLanguage =  sourceLanguage.toString();
    let strServiceType =  serviceType.toString();
    if(userRole === 'VM' || userRole === 'VC')
    {
       
        if(doc_vmpm !== '' && doc_vmpm !== 'Invalid date' )
        {
           myConn.query("UPDATE request set dor_time = ? , request_from = ? , e_code = ? , co_ordinator = ? , source_language = ? , target_language = ? , service_type = ? , particulars = ? , status = ? ,date_of_closure = ? ,doc_vmpm = ?, filename = ?, mimetype = ?, path = ? where id = ? ",[dateOfRequest,requestFrom,eCode,coOrdinator,strSourceLanguage,strTargetLanguage,strServiceType,particulars,status,doc,doc_vmpm,filename,mimetype,path,id],(err,result) =>{
                if(!err)
                {
                    res.json({
                        status:1,
                        message:"Request has been updated successfully"
                    });
                } else
                {
                    console.log(err);
                }
            })
        } else 
        {
           
              myConn.query("UPDATE request set dor_time = ? , request_from = ? , e_code = ? , co_ordinator = ? , source_language = ? , target_language = ? , service_type = ? , particulars = ? , status = ? ,date_of_closure = ? filename = ?, mimetype = ?, path = ?  where id = ? ",[dateOfRequest,requestFrom,eCode,coOrdinator,sourceLanguage,strTargetLanguage,serviceType,particulars,status,doc,filename,mimetype,path,id],(err,result) =>{
                if(!err)
                {
                    res.json({
                        status:1,
                        message:"Request has been updated successfully"
                    });
                } else
                {
                    console.log(err);
                }
            })
        }
    } else
    {
        myConn.query("UPDATE request set dor_time = ? , request_from = ? , e_code = ? , co_ordinator = ? , source_language = ? , target_language = ? , service_type = ? , particulars = ? , status = ? ,date_of_closure = ? filename = ?, mimetype = ?, path = ? where id = ? ",[dateOfRequest,requestFrom,eCode,coOrdinator,sourceLanguage,strTargetLanguage,serviceType,particulars,status,doc,filename,mimetype,path,id],(err,result) =>{
            if(!err)
            {
                res.json({
                    status:1,
                    message:"Request has been updated successfully"
                });
            } else
            {
                console.log(err);
            }
        })
    }
   
      
     

    
})



// -------------------------------Response----------------------------------------
//--------------------------------------------------------------------------------



// get all responses 
router.get("/responses",(req,res) => {
    myConn.query("SELECT * FROM  response order by id desc",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get single response
router.get("/response/:id",(req,res) => {
    let request_id =  req.params.id;
    myConn.query("SELECT * FROM response where request_id  = ?",[request_id],(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);
        } else
        {
            console.log(err);
        }
    })
})

// insert request 
router.post("/responseInsert",(req,res) =>{
    let requestID  = req.body.requestID;
    let responseBy = req.body.responseBy;
    let responseByDate = req.body.responseByDate;
    let responseComment = req.body.responseComment;
    let requestFrom = req.body.requestFrom;

    myConn.query("INSERT INTO response(request_id, response_by, response_by_date,comments) values (?,?,?,?)",[requestID,responseBy,responseByDate,responseComment],(err,result) => {
       if(!err)
        {
            let todayDate = date.format(currentDate,'YYYY-MM-DD HH:mm:ss');
            myConn.query("INSERT into comment_notification_log(request_user_id,response_user_id,request_id,response_id,comment,flag,date_entered) values (?,?,?,?,?,?,?)",[requestFrom,responseBy,requestID,result.insertId,responseComment,'unread',todayDate])

            res.json({
                status:200,
                message:"Response has been inserted successfully"
            });  
            
        } else
        {
            console.log(err);
        }

     });

})

// delete response
router.delete("/responseDelete/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("DELETE  FROM response where id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                status:1,
                message:"Response has been deleted successfully"
            });        
        } else
        {
            console.log(err);
        }
    })
})

// update request
router.put("/responseUpdate/:id",(req,res)=>{
    let requestID  = req.body.requestID;
    let responseBy = req.body.responseBy;
    let responseByDate = req.body.responseByDate;
    let id = req.params.id;
    myConn.query("UPDATE response set request_id = ? , response_by = ? , response_by_date = ?  where id = ? ",[requestID,responseBy,responseByDate,id],(err,result) =>{
        if(!err)
        {
            res.json({
                status:1,
                message:"Response has been updated successfully"
            });
        } else
        {
            console.log(err);
        }
    })
    
})

// -------------------------------Service Type----------------------------------------
//--------------------------------------------------------------------------------



// get all serviceTypes 
router.get("/serviceTypes",(req,res) => {
    myConn.query("SELECT * FROM  service_type_master order by id desc",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get single serviceType
router.get("/serviceType/:id",(req,res) => {
    let id = req.params.id;
    myConn.query("SELECT * FROM service_type_master where id = ?",[id],(err,rows,fields) => {
        if(!err)
        {
            res.send(rows[0]);
        } else
        {
            console.log(err);
        }
    })
})

// insert serviceType 
router.post("/serviceTypeInsert",(req,res) =>{
    let key  = req.body.sourceTargetKey;
    let value = req.body.sourceTargetValue;
    
    myConn.query("INSERT INTO service_type_master(`key`, `value`) values (?,?)",[key,value],(err,result) => {
       if(!err)
        {
            res.json({
                status:200,
                message:"serviceType has been inserted successfully"
            });  
            
        } else
        {
            console.log(err);
        }

     });

})

// delete serviceType
router.delete("/serviceTypeDelete/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("DELETE  FROM service_type_master where id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                status:1,
                message:"serviceType has been deleted successfully"
            });        
        } else
        {
            console.log(err);
        }
    })
})

// update serviceType
router.put("/serviceTypeUpdate/:id",(req,res)=>{
    let key  = req.body.key;
    let value = req.body.value;
    let id = req.params.id;
    myConn.query("UPDATE service_type_master set `key` = ? , `value` = ? where id = ? ",[key,value,id],(err,result) =>{
        if(!err)
        {
            res.json({
                status:1,
                message:"serviceType has been updated successfully"
            });
        } else
        {
            console.log(err);
        }
    })
    
})


// -------------------------------sourceTaretLanguage----------------------------------------
//--------------------------------------------------------------------------------



// get all sourceTaretLanguage 
router.get("/sourceTarget",(req,res) => {
    myConn.query("SELECT * FROM  source_target_master order by id desc",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get single sourceTaretLanguage
router.get("/sourceTarget/:id",(req,res) => {
    let id = req.params.id;
    myConn.query("SELECT * FROM source_target_master where id = ?",[id],(err,rows,fields) => {
        if(!err)
        {
            res.send(rows[0]);
        } else
        {
            console.log(err);
        }
    })
})

// insert sourceTaretLanguage 
router.post("/sourceTargetInsert",(req,res) =>{
    let key  = req.body.sourceTargetKey;
    let value = req.body.sourceTargetValue;
    
    myConn.query("INSERT INTO source_target_master(`key`, `value`) values (?,?)",[key,value],(err,result) => {
       if(!err)
        {
            res.json({
                status:200,
                message:"sourceTaretLanguage has been inserted successfully"
            });  
            
        } else
        {
            console.log(err);
        }

     });

})

// delete sourceTaretLanguage
router.delete("/sourceTargetDelete/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("DELETE  FROM source_target_master where id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                status:1,
                message:"sourceTaretLanguage has been deleted successfully"
            });        
        } else
        {
            console.log(err);
        }
    })
})

// update sourceTaretLanguage
router.put("/sourceTargetUpdate/:id",(req,res)=>{
    let key  = req.body.key;
    let value = req.body.value;
    let id = req.params.id;
    myConn.query("UPDATE source_target_master set `key` = ? , `value` = ? where id = ? ",[key,value,id],(err,result) =>{
        if(!err)
        {
            res.json({
                status:1,
                message:"sourceTaretLanguage has been updated successfully"
            });
        } else
        {
            console.log(err);
        }
    })
    
})



// -------------------------------status----------------------------------------
//--------------------------------------------------------------------------------



// get all status 
router.get("/status",(req,res) => {
    myConn.query("SELECT * FROM  status_master order by id desc",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get single status
router.get("/status/:id",(req,res) => {
    myConn.query("SELECT * FROM status_master where id = ?",[req.params.id],(err,rows,fields) => {
        if(!err)
        {
            res.send(rows[0]);
        } else
        {
            console.log(err);
        }
    })
})

// insert status 
router.post("/statusInsert",(req,res) =>{
    let type  = req.body.statusValue;
     myConn.query("INSERT INTO status_master(type) values (?)",[type],(err,result) => {
       if(!err)
        {
            res.json({
                status:200,
                message:"status has been inserted successfully"
            });  
            
        } else
        {
            console.log(err);
        }

     });

})

// delete status
router.delete("/statusDelete/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("DELETE  FROM status_master where id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                status:1,
                message:"status has been deleted successfully"
            });        
        } else
        {
            console.log(err);
        }
    })
})

// update status
router.put("/statusUpdate/:id",(req,res)=>{
    let type  = req.body.type;
    let id = req.params.id;
    myConn.query("UPDATE status_master set type = ? where id = ? ",[type,id],(err,result) =>{
        if(!err)
        {
            res.json({
                status:1,
                message:"status has been updated successfully"
            });
        } else
        {
            console.log(err);
        }
    })
    
})


// -------------------------------search Platform----------------------------------------
//--------------------------------------------------------------------------------



// get all searchPatform 
router.get("/searchPlatform",(req,res) => {
    myConn.query("SELECT * FROM  search_platform order by id desc",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get single searchPlatform
router.get("/searchPlatform/:id",(req,res) => {
    let id = req.params.id;
    myConn.query("SELECT * FROM search_platform where id = ?",[id],(err,rows,fields) => {
        if(!err)
        {
            res.send(rows[0]);
        } else
        {
            console.log(err);
        }
    })
})

// insert status 
router.post("/searchPlatformInsert",(req,res) =>{
    let name  = req.body.search_name;
     myConn.query("INSERT INTO search_platform(`search_name`) values (?)",[name],(err,result) => {
       if(!err)
        {
            res.json({
                status:200,
                message:"search platform has been inserted successfully"
            });  
            
        } else
        {
            console.log(err);
        }

     });

})

// delete searchPltform
router.delete("/searchPlatformDelete/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("DELETE  FROM search_platform where id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                status:200,
                message:"searchPltform has been deleted successfully"
            });        
        } else
        {
            console.log(err);
        }
    })
})

// update status
router.put("/searchPlatformUpdate/:id",(req,res)=>{
    let name  = req.body.search_name;
    let id  = req.params.id;
    myConn.query("UPDATE search_platform set `search_name` = ? where id = ? ",[name,id],(err,result) =>{
        if(!err)
        {
            res.json({
                status:200,
                message:"searchPlatform has been updated successfully"
            });
        } else
        {
            console.log(err);
        }
    })
    
})


// -------------------------------Count----------------------------------------
//--------------------------------------------------------------------------------

// get all request count
router.get("/allRequestCount/",(req,res) => {
    let userID = req.query.userID;
    
    if(userID === '01')
     {
        request({url:apiURL}, (error,response) => {
            let data = JSON.parse(response.body)
            userData = data.Output;           
            let arUser = new Array();            
            for (let index = 0; index < userData.length; index++) {        
                arUser.push(''+userData[index]['id']+'')                             
           }
           let sUserID = JSON.stringify(arUser)
           sUserID = "'"+arUser.join("','")+"'"
           
           myConn.query("SELECT count(*) as allRequests FROM  request",(err,rows,fields) => {
        if(!err)
        {
            
            res.json({
                "allRequests":rows[0]['allRequests']
            })

        } else
        {
            console.log(err);
        }
    })
        })
        
     } else
     {
    myConn.query("SELECT count(*) as allRequests FROM  request where  created_by in (?) ",[userID],(err,rows,fields) => {
        if(!err)
        {
             
            res.json({
                "allRequests":rows[0]['allRequests']
            })
   

        } else
        {
            console.log(err);
        }
    })
    }
     
})

// get open request count
router.get("/openRequestCount/",(req,res) => {
     let userID = req.query.userID;
     
     if(userID === '01')
     {
        request({url:apiURL}, (error,response) => {
            let data = JSON.parse(response.body)
            userData = data.Output;           
            let arUser = new Array();            
            for (let index = 0; index < userData.length; index++) {        
                arUser.push(''+userData[index]['id']+'')                             
           }
           let sUserID = JSON.stringify(arUser)
           sUserID = "'"+arUser.join("','")+"'"
           
           myConn.query("SELECT count(*) as openRequests FROM  request where status = '2'",(err,rows,fields) => {
        if(!err)
        {
           
            res.json({
                "openRequests":rows[0]['openRequests']
            })

        } else
        {
            console.log(err);
        }
    })
        })
        
     } else
     {
          
            myConn.query("SELECT count(*) as openRequests FROM  request where status = '2' and  created_by in (?) ",[userID],(err,rows,fields) => {
                if(!err)
                {
                    res.json({
                        "openRequests":rows[0]['openRequests']
                    })

                } else
                {
                    console.log(err);
                }
            })
     }
   
    
})

// get closed request count
router.get("/closedRequestCount/",(req,res) => {
    // let countDate = req.query.countDate;
    let userID = req.query.userID;
    
    if(userID === '01')
    {
       request({url:apiURL}, (error,response) => {
           let data = JSON.parse(response.body)
           userData = data.Output;           
           let arUser = new Array();            
           for (let index = 0; index < userData.length; index++) {        
               arUser.push(''+userData[index]['id']+'')                             
          }
          let sUserID = JSON.stringify(arUser)
          sUserID = "'"+arUser.join("','")+"'"
          
          myConn.query("SELECT count(*) as closedRequests FROM  request where status = '1'",(err,rows,fields) => {
       if(!err)
       {
           
           res.json({
               "closedRequests":rows[0]['closedRequests']
           })

       } else
       {
           console.log(err);
       }
   })
       })
       
    } else
    {

        myConn.query("SELECT count(*) as closedRequests FROM  request where status = '1' and  created_by in(?)  ",[userID],(err,rows,fields) => {
            if(!err)
            {
            res.json({
                    "closedRequests":rows[0]['closedRequests']
                })

            } else
            {
                console.log(err);
            }
        })
    }
   
})

// get onhold request count
router.get("/onHoldRequestCount/",(req,res) => {
    // let countDate = req.query.countDate;
    let userID = req.query.userID;
    if(userID === '01')
    {
       request({url:apiURL}, (error,response) => {
           let data = JSON.parse(response.body)
           userData = data.Output;           
           let arUser = new Array();            
           for (let index = 0; index < userData.length; index++) {        
               arUser.push(''+userData[index]['id']+'')                             
          }
          let sUserID = JSON.stringify(arUser)
          sUserID = "'"+arUser.join("','")+"'"
          
          myConn.query("SELECT count(*) as onHoldRequests FROM  request where status = '3'",(err,rows,fields) => {
       if(!err)
       {
           
           res.json({
               "onHoldRequests":rows[0]['onHoldRequests']
           })

       } else
       {
           console.log(err);
       }
   })
       })
       
    } else
    {
    myConn.query("SELECT count(*) as onHoldRequests FROM  request where status = '3' and created_by in (?) ",[userID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                "onHoldRequests":rows[0]['onHoldRequests']
            })

        } else
        {
            console.log(err);
        }
    })
    }
})
 
// get Cancelled request count
router.get("/cancelledRequestCount/",(req,res) => {
    // let countDate = req.query.countDate;
    let userID = req.query.userID;
    if(userID === '01')
    {
       request({url:apiURL}, (error,response) => {
           let data = JSON.parse(response.body)
           userData = data.Output;           
           let arUser = new Array();            
           for (let index = 0; index < userData.length; index++) {        
               arUser.push(''+userData[index]['id']+'')                             
          }
          let sUserID = JSON.stringify(arUser)
          sUserID = "'"+arUser.join("','")+"'"
          
          myConn.query("SELECT count(*) as cancelledRequests FROM  request where status = '4'",(err,rows,fields) => {
       if(!err)
       {
           
           res.json({
               "cancelledRequests":rows[0]['cancelledRequests']
           })

       } else
       {
           console.log(err);
       }
   })
       })
       
    } else
    {
     myConn.query("SELECT count(*) as cancelledRequests FROM  request where status = '4' and  created_by in (?) ",[userID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                "cancelledRequests":rows[0]['cancelledRequests']
            })

        } else
        {
            console.log(err);
        }
    })
    }
   
})


// get Cancelled request count
router.get("/delayRequestCount/",(req,res) => {
    // let countDate = req.query.countDate;
    let userID = req.query.userID;
    if(userID === '01')
    {
       request({url:apiURL}, (error,response) => {
           let data = JSON.parse(response.body)
           userData = data.Output;           
           let arUser = new Array();            
           for (let index = 0; index < userData.length; index++) {        
               arUser.push(''+userData[index]['id']+'')                             
          }
          let sUserID = JSON.stringify(arUser)
          sUserID = "'"+arUser.join("','")+"'"
          
          myConn.query("SELECT count(*) as delayRequestCount FROM  request where doc_vmpm > date_of_closure ",(err,rows,fields) => {
        
       if(!err)
       {
           res.json({
               "delayRequestCount":rows[0]['delayRequestCount']
           })

       } else
       {
           console.log(err);
       }
   })
       })
       
    } else
    {
    myConn.query("SELECT count(*) as delayRequestCount FROM  request where created_by in (?) and  doc_vmpm > date_of_closure ",[userID],(err,rows,fields) => {
        if(!err)
        {
           res.json({
                "delayRequestCount":rows[0]['delayRequestCount']
            })

        } else
        {
            console.log(err);
        }
    })
    }
   
})

 
// get All Masters
router.get("/getAllMasters",(req,res) => {
    myConn.query("select * from service_type_master;select * from source_target_master;select * from status_master;select * from search_platform",(err,rows,fields) => {
        if(!err)
        {
            res.json({
                "serviceMaster":rows[0],
                "sourceTargeteMaster":rows[1],
                "stateMaster":rows[2],
                "searchPlatformMaster":rows[3],
            })

        } else
        {
            console.log(err);
        }
    })
})

// get open request
router.get("/openRequest",(req,res) => {
    myConn.query("SELECT * FROM `request` WHERE `status` = '2'",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get closed request
router.get("/closedRequest",(req,res) => {
    myConn.query("SELECT * FROM `request` WHERE `status` = '1'",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get OnHold request
router.get("/onHoldRequest",(req,res) => {
    myConn.query("SELECT * FROM `request` WHERE `status` = '3'",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get Cancelled request
router.get("/cancelledRequest",(req,res) => {
    myConn.query("SELECT * FROM `request` WHERE `status` = '4'",(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})


// get Delay request
router.get("/delayRequest/",(req,res) => {
    // let countDate = req.query.countDate;
    let userID = req.query.userID;
    if(userID === '01')
    {
       request({url:apiURL}, (error,response) => {
           let data = JSON.parse(response.body)
           userData = data.Output;           
           let arUser = new Array();            
           for (let index = 0; index < userData.length; index++) {        
               arUser.push(''+userData[index]['id']+'')                             
          }
          let sUserID = JSON.stringify(arUser)
          sUserID = "'"+arUser.join("','")+"'"
          
          myConn.query("SELECT * FROM  request where created_by in  ("+sUserID+")  and  doc_vmpm > date_of_closure ",(err,rows,fields) => {
        
       if(!err)
       {
        res.send(rows);

       } else
       {
           console.log(err);
       }
   })
       })
       
    } else
    {
    myConn.query("SELECT *  FROM  request where created_by in (?) and  doc_vmpm > date_of_closure ",[userID],(err,rows,fields) => {
        if(!err)
        {
            res.send(rows);

        } else
        {
            console.log(err);
        }
    })
    }
   
})
// get Language List
router.get("/languageList",(req,res) => {
    myConn.query("select `key`,`value` from source_target_master",(err,rows,fields) => {
        if(!err)
        {
            
           res.send(rows);

        } else
        {
            console.log(err);
        }
    })
})

// get report Data
router.get("/report/:dateValue",(req,res) => {
    var dateValue = req.params.dateValue;
    myConn.query("SELECT request.id,request.request_from,request.dor_time,request.e_code,request.co_ordinator,source_target_master.key as source_language,source_target_master.key as target_language,service_type_master.value as service_type,request.particulars,status_master.type as `status` FROM `request` inner join source_target_master on request.source_language = source_target_master.value inner join service_type_master on request.service_type = service_type_master.key inner join status_master on request.status = status_master.id WHERE request.dor_time like concat('%',?,'%') order by dor_time desc",[dateValue],(err,rows,fields) => {
     
         
        const url = "http://192.168.1.24:9000/api/all_user_list/";
        let userIDName = {};
        request({url:url}, (error,response) => {
            let data = JSON.parse(response.body)
            userData = data.Output;
            userData.map((item,index) => {
                userIDName[item.id] = item.name
            })
           

            for (let index = 0; index < rows.length; index++) {        
        
                var  requestFrom = rows[index]['request_from']
                var  coOrdinator = rows[index]['co_ordinator']
                var  requestDate = rows[index]['dor_time']
                rows[index]['id'] = index+1
                rows[index]['request_from'] =  userIDName[requestFrom]
                rows[index]['co_ordinator'] = userIDName[coOrdinator]  
                rows[index]['dor_time'] = date.format(requestDate,'YYYY-MM-DD HH:mm'); 
               
           }
            res.send(rows);
        })
       
    })

   
})

 

// get requestMonth Data
router.get("/requestMonthData/:dateValue",(req,res) => {
let dbDate = req.params.dateValue;
myConn.query("SELECT e_code FROM  request where dor_time like concat('%',?,'%')",[dbDate],(err,rows,fields) => {
        
         if(!err)
        {
            res.send(rows); 
            
        } else
        {
            console.log(err);
        }   

})

})

// get requestMonth Data
router.get("/dateRangeReport/",(req,res) => {
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    myConn.query("SELECT request.id,request.request_from,request.dor_time,request.e_code,request.co_ordinator,source_target_master.key as source_language,source_target_master.key as target_language,service_type_master.value as service_type,request.particulars,status_master.type as `status` FROM `request` inner join source_target_master on request.source_language = source_target_master.value inner join service_type_master on request.service_type = service_type_master.key inner join status_master on request.status = status_master.id WHERE dor_time BETWEEN ? AND  ?",[fromDate,toDate],(err,rows,fields) => {
        
        const url = "http://192.168.1.24:9000/api/all_user_list/";
let userIDName = {};
request({url:url}, (error,response) => {
    const data = JSON.parse(response.body)
    userData = data.Output;
    userData.map((item,index) => {
        userIDName[item.id] = item.name
    })
   

    for (let index = 0; index < rows.length; index++) {        

        var  requestFrom = rows[index]['request_from']
        var  coOrdinator = rows[index]['co_ordinator']
        var  requestDate = rows[index]['dor_time']
        rows[index]['id'] = index+1
        rows[index]['request_from'] =  userIDName[requestFrom]
        rows[index]['co_ordinator'] = userIDName[coOrdinator]  
        rows[index]['dor_time'] = date.format(requestDate,'YYYY-MM-DD HH:mm'); 
       
   }
    res.send(rows);
})  
    
    })
    
    })

    // get Request Notification Count
router.get("/requestNotificationCount/",(req,res) => {
    myConn.query("SELECT count(id) as notificationCount FROM notification_log where flag = 'unread'",(err,rows,fields) => {
            
             if(!err)
            {
                res.send(rows[0]); 
                
            } else
            {
                console.log(err);
            }   
    
    })
    
    })

        // get Request Notification List
router.get("/requestNotificationList/",(req,res) => {
    myConn.query("SELECT *  FROM notification_log where flag = 'unread' order by date_entered desc",(err,rows,fields) => {
            
             if(!err)
            {
                res.send(rows); 
                
            } else
            {
                console.log(err);
            }   
    
    })
    
    })

    // delete response
router.delete("/updateNotificationFlag/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("update notification_log set flag='read' where id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                status:1,
                message:"Notification log has been deleted successfully"
            });        
        } else
        {
            console.log(err);
        }
    })
})

        // get Response List
        router.get("/responseNotificationList/",(req,res) => {
            let userID = req.query.userID;
            myConn.query("SELECT *  FROM comment_notification_log where flag = 'unread' and request_user_id = ? order by date_entered desc",[userID],(err,rows,fields) => {
                    
                     if(!err)
                    {
                        //console.log(rows)
                       
                        res.send(rows); 
                        
                    } else
                    {
                        console.log(err);
                    }   
            
            })
            
            })

   // get Response Notification Count
   router.get("/responseNotificationCount/",(req,res) => {
    let userID = req.query.userID;
    
    myConn.query("SELECT count(id) as notificationCount FROM comment_notification_log where flag = 'unread' and request_user_id = ? ",[userID],(err,rows,fields) => {
            
             if(!err)
            {
                res.send(rows[0]); 
                
            } else
            {
                console.log(err);
            }   
    
    })
    
    })

        // delete response
router.delete("/updateResponseNotificationFlag/:id",(req,res) => {
    var deleteID = req.params.id;
    myConn.query("update comment_notification_log set flag='read' where id =?",[deleteID],(err,rows,fields) => {
        if(!err)
        {
            res.json({
                status:1,
                message:"Notification log has been deleted successfully"
            });        
        } else
        {
            console.log(err);
        }
    })
})

module.exports = router;
