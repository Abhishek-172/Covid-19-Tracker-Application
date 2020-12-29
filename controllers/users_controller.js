//Importing GOT library for fetching api
const got = require('got'); 
//Importing User Model
const User = require('../models/users'); 
//Importing D3-node and d3 for creating bar graph
const D3Node = require('d3-node'); 
const d3 = require('d3');
// fs is required to generate the svg file
const fs = require('fs');
//Importing Sharp for converting .svg file to .png file
const sharp = require('sharp');
//Using nodemailer for sending mails to the recipients
const nodemailer = require('nodemailer');
//Declaring Variables
var user_email_id;
var user_name;
var country_name;
var api_endpoint;
var todayDeath;
var todayconfirmedcases;
var latest_death;
var latest_confirmed;
var latest_recovered;
var latest_critical;


//Created the createsession controller for creating an session for the logged in user

module.exports.createsession = function(req, res)
{
    //Finding the user with "email" in db
    User.findOne({email: req.body.email}, function(err, user)
    {
        //If user is present
        if(user)
        {
            //set the variables emailid, name and country
            user_email_id = user.email;
            user_name = user.firstname;
            country_name = user.country;
            //If user is present then redirect the user to home page
            return res.redirect('/');
        }
    })    
    
}


//Signin controller - If user queries for signin page
module.exports.signin = function(req, res)
{
    //If request is authenticated then redirect the user to home page
    if (req.isAuthenticated())
    {
        res.redirect('/');
    }

    //If not then redirect the user to signin page

    return res.render('signin');
}



//Signup Controller - If user queries for signup pages
module.exports.signup = function(req, res)
{
    if (req.isAuthenticated())
    {
        res.redirect('/');
    }
    return res.render('signup');
}



//Create controller - For creating the user in our system
module.exports.create = function(req, res)
{
    //Checking whether user is present in Database or not
    User.findOne({email: req.body.email}, function(err, user)
    {
        if(err)
        {
            console.log("User is not present in Database");
            return;
        }    
        //If user is not present lets create the user
        if(!user)
        {
            User.create(req.body, function(err, user)
            {
                console.log(req.body);
                if(err)
                {
                     return;
                }
                //Once the user is created redirect the user to signin page
                return res.redirect('/users/signin');
            });
        }
    });
    //Checking what all fields were entered by the user
    console.log(req.body);
}


//Signout Controller
module.exports.destroysession = function(req, res)
{
    //Log out the user
    req.logout();
    //And redirect the user to signin page
    return res.redirect('/users/signin');
}



// Controller for Handling API 
// Processing the API request data
// Creating a Bar graph out of that API data
// Sending the Mail to the user along with the attachment 

module.exports.handlingapirequest = function(req, res)
{

    //Declaring Variables for Processing API Data
    var user_specific_country = req.body.country;
    api_endpoint =  "https://corona-api.com/countries"+"/"+user_specific_country; 
    
    //Fetching API data using GOT library
    
    got(api_endpoint).then((response)=>
    {        
        //Putting response.body in data {Whatever the data we have recieved}
        const data = response.body;
        // console.log(data.timeline);
        //Parsing the data in JSON format
        const JSON_FORMAT_DATA = JSON.parse(data);
        // Getting JSON Data, and storing it to the variables below
        todayDeath = JSON_FORMAT_DATA.data.today.deaths;
        todayconfirmedcases = JSON_FORMAT_DATA.data.today.confirmed;
        latest_death = JSON_FORMAT_DATA.data.latest_data.deaths;
        latest_confirmed = JSON_FORMAT_DATA.data.latest_data.confirmed;
        latest_recovered = JSON_FORMAT_DATA.data.latest_data.recovered;
        latest_critical = JSON_FORMAT_DATA.data.latest_data.critical;
        
        //Processed The API data Below

        // console.log("Below is the detailed data from API of last 4 months");
        // console.log("todayDeath:", todayDeath);
        // console.log("today_confirmed_cases:", todayconfirmedcases);
        // console.log("latest_death:", latest_death);
        // console.log("latest_confirmed", latest_confirmed);
        // console.log("latest_recovered", latest_recovered);
        // console.log("latest_critical", latest_critical);

 
        // Creating a Bar Graph using d3 libraries in SVG

        const options = 
        {   
            d3Module: d3,
            selector: '#chart',
            container: '<div id="container"><div id="chart"></div></div>'
        };

        // Create a d3-node object with the selector and the required d3 module
        const d3n = new D3Node(options);


        //Setting Margin
        const margin = 
        {
            top: 10,
            right: 5,
            bottom: 30,
            left: 5
        };

        //Setting the height and width of SVG container
        const width = 1000 - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;
        const svgWidth = width + margin.left + margin.right;
        const svgHeight = height + margin.top + margin.bottom;

        // Create an svg element with the width and height defined.
        const svg = d3n.createSVG(svgWidth, svgHeight);

        // Creating dataset
        const tempData = 
        [{ COVID_DATA: "Deaths_Today", value: todayDeath }, { COVID_DATA: "Confirmed_Cases_Today", value: todayconfirmedcases }, { COVID_DATA: "latest_deaths", value: latest_death }, { COVID_DATA: "latest_confirmed", value: latest_confirmed }, { COVID_DATA: "latest_recovered", value: latest_recovered }, { COVID_DATA: "latest_critical", value: latest_critical }];

        // Create the scales for x-axis and y-axis. 
        const xScale = d3.scaleBand().range([0, width]).padding(0.4);
        const yScale = d3.scaleLinear().range([height, 0]);

        let yMax = d3.max(tempData, (d) => { return d.value; });
        yMax += yMax * 0.3; 
        xScale.domain(tempData.map((d) => { return d.COVID_DATA; }));
        yScale.domain([0, yMax]);


        // Set the background of the entire svg to a desired color.
        //  This will make the background look uniform on everyone's computer.
        svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .style("fill","rgb(244,244,244)");

        // Add a title text to bar chart. 
        svg.append('text')
        .attr('transform', 'translate(150,0)')
        .attr('x', 575)
        .attr('y', 50)
        .attr('font-size', '25px')
        .attr('font-family', 'Verdana, Geneva, Tahoma, sans-serif')
        .text('COVID-19 Bar Graph');

        // Append a group element to which the bars and axes will be added to.
        svg.append('g').attr('transform', `translate(${ 100 },${ 100 })`);

        // Appending x-axis
        svg.append('g')
        .attr('transform', `translate(50,${ height })`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('y', height - 280)
        .attr('x', width - 500)
        // .attr('text-anchor', 'end')
        .attr('stroke', 'black')
        .attr('font-size', '18px')
        .attr('font-family', 'Verdana, Geneva, Tahoma, sans-serif')
        .attr('letter-spacing', '1rem')
        .text('COVID-DATA');

        // Appending y-aixs
        svg.append('g')
        .attr('transform', 'translate(50,0)')
        .call(d3.axisLeft(yScale).tickFormat((d) => 
        {
            return `${ d }`;
        })
            .ticks(5))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 150)
        .attr('x', -160)
        .attr('dy', '-9.1em')
        .attr('text-anchor', 'end')
        .attr('stroke', 'black')
        .attr('font-size', '20px')
        .text('Scale In Numbers');

         // Appending the bars
        svg.selectAll('.bar')
        .data(tempData)
        .enter().append('rect')
        .attr('transform', 'translate(50,0)')
        .attr('class', 'bar')
        .attr('x', (d) => { return xScale(d.COVID_DATA); })
        .attr('y', (d) => { return yScale(d.value); })
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => { return height - yScale(d.value); })
        .style('fill', 'lightgreen');


        // Create a SVG. 
        fs.writeFileSync('out.svg', d3n.svgString());

        // Convert the SVG into a PNG. 
        sharp('out.svg')
            .png()
            .toFile('sharp.png')
            .then((info) => {
                console.log('Svg to Png conversion completed', info);
            })
            .catch((err) => {
                console.log(err);
            });


            //Sending the Mail using nodemailer
            //Here we are just defining the object and also the configuration
            // using which I will be sending emails to the user
            let mailTransporter = nodemailer.createTransport({ 
                service: 'gmail', 
                auth: { 
                    user: "wearetrackingcovid@gmail.com", 
                    pass: 'app#123456'
                } 
            }); 
            // Defining the mail details like from where the send should sent to whom
            // it should be sent with attachmet and all
            let mailDetails = { 
                from: 'wearetrackingcovid@gmail.com', 
                to: user_email_id, 
                subject: 'Test mail', 
                text: "Greetings "+user_name+",\n"+"The Bar Graph for country "+country_name+" is generated.\n"+"Please Check.\n"+"Thanks for choosing our platform.",
                attachments: [
                    {filename: 'sharp.png', path: './sharp.png'}
                ]
            }; 
            // Using the mailTransporter object to send the mail
            mailTransporter.sendMail(mailDetails, function(err, data) { 
                if(err) { 
                    console.log('Error Occurs', err); 
                } else { 
                    console.log('Email sent successfully'); 
                } 
            });    
            // Once the email is sent redirect the user to Home Page
        return res.redirect('/');

    }).catch((error) => {
        console.log(error);
    });       
}
