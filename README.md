# FastCat


## System Description ##
 
FastCat is a Web-based system designed for historians and other researchers who need to manually digitize
structured and semi structured archival documents in a fast and accurate way to create their research
dataset. It combines the ease of use and quick data entry functions of the classic spreadsheet with the
information accuracy typically associated with a complex database. It does so by offering data entry
templates designed to mirror, in the digital space, the structure and data entry logic of the original source. 

In FastCat, archival documents are transcribed as ‘records’ belonging to specific ‘templates’, where a ‘template’ represents the structure of a single type of archival source. A record organizes the data and metadata in tables, offering functionalities like nesting tables and selection of term from a vocabulary.
The system runs locally inside any modern web browser with possibility of automated synchronisation with an online database. 


**Data Curation with FastCat Team**

FastCat Team is a special environment within FastCat that allows the collaborative curation of the transcribed data through the management of 'entities' and 'vocabulary terms'. With respect to the management of entities, users can inspect the main entity instances that appear in the data (e.g., names of persons or locations) and start curating them. Here a first automated curation step considers a set of rules for giving the same identity to a set of entity instances
having some common characteristics. Then, the available curation actions include: i) corrections of entity names or other entity properties, ii) indication that two or more entity instances refer to the same real-world entity, thus they must have the same identity (manual instance matching), and iii) indication that a specific instance from a set of automatically matched instances is a different entity and thus must have a different identity. 

With respect to the curation of vocabulary terms, users can provide a preferred term in English as well as its broader term (if any). The storage of broader terms provides an hierarchy for the terms, which can be very useful when exploring the data. For example, one can retrieve all data related to a general term through its narrow terms.

An important characteristic of FastCat Team is that it does not alter the data in the records as transcribed from the original sources. It achieves this by storing the curated data in a different database and maintaining the links to the original data. Maintaining this provenance information is very important for data verification and long-term validity, but also because data consolidation may be ambiguous and require further research and repeated revision at any time in the future. 

More information about FastCat (and FastCat Team) is available [here](https://www.ics.forth.gr/isl/fast-cat) and in the following publication: 

```
P. Fafalios, K. Petrakis, G. Samaritakis, K. Doerr, A. Kritsotaki, Y. Tzitzikas, and M. Doerr,
"FAST CAT: Collaborative Data Entry and Curation for Semantic Interoperability in Digital Humanities",
ACM Journal on Computing and Cultural Heritage, 2021.
``` 
([Paper PDF](http://users.ics.forth.gr/~fafalios/files/pubs/fafaliosJOCCH2021.pdf) | [BIB Entry](http://users.ics.forth.gr/~fafalios/files/bibs/fafaliosJOCCH2021.bib))

**Manuals**

- Instructions on how to use FastCat: [FastCat User Guide](https://isl.ics.forth.gr/FastCatTeam/Manual.pdf)

- Instructions on how to use FastCat Team: [FastCat Team User Guide](https://isl.ics.forth.gr/FastCatTeam/Manual%20Fast%20Cat%20Team_Version%202.1.pdf)

## Getting Started

### Built With

* [jQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)
* [handsontable](https://handsontable.com/)
* [CouchDB](https://couchdb.apache.org/)

### Dependency

FastCat uses [handsontable](https://handsontable.com/) library for some data entry functionalities. If you use this project for commercial purposes (whether in internal or externally facing projects), you need to purchase a [Handsontable license](https://handsontable.com/pricing).

### Prerequisites

* Java
* Tomcat
* CouchDB (installation documentation can be found [here](https://docs.couchdb.org/en/stable/install/index.html))

### Installation and deployment

 1. Database configuration
 
     After successful CouchDB installation, database must have the following structure: 
 
           ├── _users
           ├── admin
           ├── instances
           │   ├── instance 1
           │   ├── instance 2
           │   └── ...
           ├── public_records
           │   ├── record 1
           │   ├── record 2
           │   └── ...
           ├── public_vocabs
           └── templates
               ├── template 1
               └── etc
     
     
2. Clone the repo
   ```sh
   git clone https://github.com/isl/FastCat.git
   ```
3. The project is written mainly in JavaScript so it can be deployed directly on a web server (eg. Tomcat v7 or greater). 
    Before deployment a basic configuration must be done by editing the database urls in the 
    /js/global.js file

    ```json
        "config": {
            "": {
                "http:": "http://[URL]:[PORT]",
                "https:": "https://[URL]"
            }      
        }
    ```
     
## Configuration of Transcription Templates ##

To configure/create a new Template the following steps must be followed: 

1. FastCat Application

   Each template consists of two files: 
   * templates/template.html (example)
   * templates/js/template.js (example) 
   
   By editing these two files user can create/modify templates.
  
2. Database

   To add a new template in the database : 
   * Go to templates directory and copy one existing template
   * Return to templates directory and Create Document
   * Paste the json you copied before
   * delete the "_rev" row and change the "_id" value to be exactly the same as the name of the new template

## Contact ##

- Fafalios Pavlos <fafalios@ics.forth.gr>
- Samaritakis Georgios <samarita@ics.forth.gr>
- Petrakis Kostas <cpetrakis@ics.forth.gr>

## Acknowledgements ##

This work has received funding from the European Union's Horizon 2020 research and innovation programme under i) the European Research Council (ERC) grant agreement No 714437 ([Project SeaLiT](https://sealitproject.eu/)), and ii) the Marie Sklodowska-Curie grant agreement No 890861 ([Project ReKnow](https://reknow.ics.forth.gr/)).

