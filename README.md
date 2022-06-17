# FastCat


### Description ###

FastCat is a Web-based system designed for historians and other researchers who need to manually digitize
structured and semi structured archival documents in a fast and accurate way to create their research
dataset. It combines the ease of use and quick data entry functions of the classic spreadsheet with the
information accuracy typically associated with a complex database. It does so by offering data entry
templates designed to mirror, in the digital space, the structure and data entry logic of the original source. 

In FastCat, archival documents are transcribed as ‘records’ belonging to specific ‘templates’, where a ‘template’ represents the structure of a single typoe of archival source. A record organizes the data and metadata in tables, offering functionalities like nesting tables and selection of term from a vocabulary.
The system runs locally inside any modern web browser with possibility of automated synchronisation with an online database. 

FastCat is basically a data entry tool with main role to digitize historical sources and to enter even complex structures of information in an easy way to the database. It is not designed to process the information.
Data can be processed on the “FastCatTeam” (read manual of Fast Cat team) an online system where the
data from FastCat is automatically uploaded.

Further information about FastCat can be found in the Manual.pdf file.

### Data Curation with FastCat Team ###

FastCat Team is an online web application that aims to assist the user to process the digitized data from historical
sources that have been introduced to FastCat. This tool gives the person who did the transcription the opportunity to curate the digitized raw data and export them in different formats.

Further information about FastCatTeam can be found in the Manual Fast Cat Team_Version 2.1.pdf file.

### Dependencies ###

FastCat uses [handsontable](https://handsontable.com/) library for some data entry functionalities. If you use this project for commercial purposes you need to purchase a license from [here](https://handsontable.com/pricing).

### Installation ###

This project is written mainly in JavaScript so it can be deployed directly on a web server (eg. Tomcat v7 or greater).

### Configuration ###

FastCat uses [CouchDB](https://couchdb.apache.org/) and [PouchDB](https://pouchdb.com/) for storing and syncronizing all the data so a basic configuration must be done by editing the database urls in the 
/js/global.js file

```json
    "config": {
        "": {
            "http:": "http://[URL]:[PORT]",
            "https:": "https://[URL]"
        }      
    }
```

### 4. Contact ### 

Fafalios Pavlos < fafalios@ics.forth.gr >

Samaritakis Georgios < samarita@ics.forth.gr >

Petrakis Kostas < cpetrakis@ics.forth.gr >


