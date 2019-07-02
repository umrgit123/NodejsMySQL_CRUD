const mysql = require('mysql');
const express = require('express');
var   app = express();
const bodyParser = require('body-parser');
const methodOverride = require(`method-override`);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
    extended: true}));

var pool = require('./database');

app.get("/", function(req, res){
	pool.query('SELECT * FROM employee', (err, rows, fields) => {
        if (!err) {
			return res.render("indexemp",{employees: rows});
		}
        else
            console.log(err);
    });
});



//Get all employees
app.get('/employees', (req, res) => {
    pool.query('SELECT * FROM employee', (err, rows, fields) => {
        if (!err) {
			return res.render("indexemp",{employees: rows});
		}
        else
            console.log(err);
    });
});

//Add new employee - show blank page to add data
app.get('/employees/new', (req, res) => {
            return res.render("newemp");
});

//Get an employee
app.get('/employees/:id', (req, res) => {
	console.log("req params id :" + req.params.id);
    pool.query('SELECT * FROM employee WHERE EmpId = ?', req.params.id, (err, rows, fields) => {
		console.log("here");
        if (!err && rows.length > 0) {
            return res.render("showemp", {employee: rows[0]});
		}
        else { 
			if (!err && rows.length == 0) {
            	console.log("Record not found");
				return res.redirect("/employees");
			}
			else if(err)
				{
					consolelog(err);
					return res.redirect("/employees");
				}
		}
    });
});

//Edit an employee
app.get('/employees/:id/edit', (req, res) => {
pool.query('SELECT * FROM employee WHERE EmpID = ?', req.params.id, (err, rows, fields) => {
        if (!err && rows.length > 0){
            return res.render("showemp", {employee: rows[0]});
		}
        else
			if (!err && rows.length == 0) {
            	console.log("Record not found");
				return res.redirect("/employees");
			}
			else
				{
					consolelog(err);
					return res.redirect("/employees");
				}
    });
});


//Add new employee - show blank page to add data
app.get('/employees/new', (req, res) => {
            return res.render("newemp");
});


//Delete an employees
app.delete('/employees/:id', (req, res) => {
    pool.query('DELETE FROM employee WHERE EmpID = ?', req.params.id, (err, rows, fields) => {
        if (!err)
            return res.redirect("/employees");
        else
            console.log(err);
    });
});

//Add an employee
app.post('/employees', (req, res) => {
	var emp = {
        Fname: req.body.firstname,
		Lname: req.body.lastname,
		DeptId: req.body.dept	
    };
	var sql = "INSERT INTO employee (Fname, Lname, DeptId) values (?,?,?)";
    pool.query(sql, [emp.Fname, emp.Lname, emp.DeptId], (err, rows, fields) => {
        if (!err) {
				return res.redirect("/employees");
            }
        else
            console.log(err);
    });
});


//Update an employee
app.put('/employees/:id', (req, res) => {
	var emp = {
		EmpId: req.body.empid,
        Fname: req.body.firstname,
		Lname: req.body.lastname,
		DeptId: req.body.dept	
    };
	var sql = "UPDATE employee SET Fname = ?,  Lname = ?, DeptId = ? where EmpId = ?";
    pool.query(sql, [emp.Fname, emp.Lname, emp.DeptId, emp.EmpId], (err, rows, fields) => {
        if (!err) {
                return res.render("showemp", {employee: emp});
            }
        else
            console.log(err);
    });
});

app.listen(process.env.PORT, process.env.IP, () => console.log('Express server has started'));
