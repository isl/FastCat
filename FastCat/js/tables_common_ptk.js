/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var persons_instances_fromJSON;
var ships_instances_fromJSON;

var vocabularies_fromJSON;

$.getJSON('../instances/instances.json', function (data) {
    persons_instances_fromJSON = data.persons;
    ships_instances_fromJSON = data.ships;
    vocabularies_fromJSON = data.vocabularies;

});

var template_types = new Object();

/////////////////////////EXCEL FUNCTIONS////////////////////////////////

/////////////////////////
function createExcelSheetsData(sheets, groupTables, json) {

    $.each(groupTables, function (cnt) {
        
        var sheet = new Object();
        if (Object.keys(this).length < 2) {
            $.each(this, function () {
                $.each(this, function (i) {
                    sheet[i] = this;
                });
            });
            sheets.push(sheet);
        } else {
            
            var length = 0;
            if (this[Object.keys(this)[0]]) {
                length = this[Object.keys(this)[0]].length;
            }
          
            for (var i = 0; i < length; i++) {
                var tmp = new Object();
                 
               
                var head,kk,obj;
                 
                $.each(this, function () {
                    var headers = this;
                    head = headers;
                    
                    if (this[i]) {
                        var keys = Object.keys(this[i]);
                        kk=keys;
                        tmp['row'] = (headers[i][keys[0]]);
                        tmp[keys[1]] = (headers[i][keys[1]]);
                    
                        if (json) {
                            obj = json[head[i][kk[0]] - 2];
                            delete obj[keys[1]];
                        }
                    }
                });
                tmp[' '] = "  ";
                
                //  embend rest columns except from nested
             
                    if ((json) /*&& ((head[i][kk[1]].length) > 0)*/) {
                    $.each(obj, function (key) {
                        if ((this.toString()).indexOf("\n") < 0) {
                            tmp[key] = this.toString();
                        }
                    });

                }
                sheet[i] = tmp;
            }

            if (Object.keys(sheet).length > 0) {
                sheets.push(sheet);
            }
        }
    });

    return sheets;
}
;

////////////////////////////////////////////////////////////////////////////////

function createExcelopts(lbls, groupTables) {

    var result = new Array();

    $.each(lbls, function (cnt) {
        var tmp = new Object();
        tmp["sheetid"] = lbls[cnt];
        tmp["header"] = true;
        result.push(tmp);
    });

    $.each(groupTables, function (cnt) {
        var tmp = new Object();
        tmp["sheetid"] = Object.keys(this)[0] + " (Multiple)";
        tmp["header"] = true;
        result.push(tmp);
    });

    return result;
}
;

///////////////////////////////////////////////////////////////////////////////

function createMultipleTables(json, groups, columns, tbl_label) {

    var groupTables = new Object();
   // console.log(groups)
    $.each(groups, function (cnt) {
        if (this[0] === this[1]) {
            var singletmp = new Object();
            singletmp[columns[this[0]].data] = multipleTable2excel(json, columns[this[0]].data, tbl_label);
            groupTables[cnt] = singletmp;
        } else {
            var multipletmp = new Object();
            for (var i = this[0]; i < this[1] + 1; i++) {
                multipletmp[columns[i].data] = multipleTable2excel(json, columns[i].data, tbl_label);
            }
            groupTables[cnt] = multipletmp;
        }
    });
    return groupTables;
}
;
//////////////////////////////////////////////////////////////////////////////

function createMultipleNestedTables(json, original_groups, previous_cols, cols) {

    var columns = new Array();
    columns = previous_cols;
    columns = columns.concat(cols);
    var prev_cols_length = previous_cols.length;

    var groups = new Array();
    $.each(original_groups, function (cnt) {
        var val = new Array();
        val.push(this[0] + prev_cols_length) - 1;
        val.push(this[1] + prev_cols_length) - 1;
        groups.push(val);
    });

    var groupTables = new Object();

    $.each(groups, function (cnt) {
        if (this[0] === this[1]) {
            var singletmp = new Object();
            var res = new Array();
            var col_label = this[0];
            var obj_size = 0;
            $.each(json, function (j) {
                obj_size = obj_size + Object.keys(this).length;
                var lngth = 0;
                if (j === 0) {
                    lngth = 0;
                } else {
                    lngth = obj_size - Object.keys(this).length;
                }
                $.each((multipleTable2excel(this, columns[col_label].data, lngth)), function () {
                    res.push(this);
                });
            });
            singletmp[columns[this[0]].data] = res;
            groupTables[cnt] = singletmp;
        } else {
            var multipletmp = new Object();
            for (var i = this[0]; i < this[1] + 1; i++) {
                var data = new Array();
                var objlength = 0;
                $.each(json, function (j) {
                    objlength = objlength + Object.keys(this).length;
                    var lngth = 0;
                    if (j === 0) {
                        lngth = 0;
                    } else {
                        lngth = objlength - Object.keys(this).length;
                    }
                    $.each(multipleTable2excel(this, columns[i].data, lngth), function () {
                        data.push(this);
                    });
                });
                multipletmp[columns[i].data] = data;
                groupTables[cnt] = multipletmp;
            }
        }
    });
    return groupTables;
}
;
//////////////////////////////////////////////////////////////////////////////
function multipleTable2excel(json, label, prev_length) {

    var result = new Array();
    if (!prev_length) {
        prev_length = 0;
    }

    $.each(json, function (cnt) {

        if (isNaN(cnt)) {
            console.log('need fix');
        } else {

            var cell_value = this[label];
            if (cell_value) {
                cell_value = cell_value.replace(/\n/ig, '`\n');
            } else {
                cell_value = "";
            }
            var multiple_vals = "";
            var tmp = new Array();
            if ((cell_value !== null) && ((cell_value).indexOf("\n") > 0)) {
                multiple_vals = (cell_value).split("\n");
                $.each(multiple_vals, function (i) {
                    tmp.push(multiple_vals[i]);
                });

                $.each(tmp, function (i) {
                    var tmpobj = new Object();
                    tmpobj['row'] = parseInt(cnt) + prev_length + 2;
                    tmpobj[label] = tmp[i].replace('`', '');
                    result.push(tmpobj);
                });
            } else {
                var tmp = new Object();
                tmp['row'] = parseInt(cnt) + prev_length + 2;
                if (cell_value === null) {
                    tmp[label] = "";
                } else {
                    tmp[label] = cell_value;
                }
                result.push(tmp);
            }
        }
    });

    if (result.length > 0) {
        return(result);
    } else {
        result.push('');
        return(result);
    }

}
;

////////////////////////////////  DATE FIX   /////////////////////////////////
//////////////////////// transform dates into correct format//////////////////

function fix_dates(cols, data) {

    var dates = new Array();
    $.each(cols, function () {
        if (this.type === 'date') {
            dates.push(this.data);
        }
    });

    $.each(dates, function (i) {
        var label = dates[i];
        $.each(data, function () {
            var formated = this[label];
            console.log(formated);
            formated = format_date(formated);
            console.log(formated);
            this[label] = formated;
        });
    });

    return data;
}
;

function format_date(date) {
    if (date) {
       
        if (((date[2] === ".") && (date[5] === ".")) || ((date[2] === "/") && (date[5] === "/")) || ((date[2] === "\"") && (date[5] === "\""))) {
            var mm = date.substring(3, 5);
            var yy = date.substring(6, 10);
            var dd = date.substring(0, 2);
            date = yy + "-" + mm + "-" + dd;
        }
        return date;
    } else {
        return date;
    }
}
;
////////////////////////////////////////////////////////////////////////////////
function parse_location(value) {


    var location = new Object();

    var initial = '';
    if (value) {
        initial = value.split('-');
    }
    var direction = '';

    if (initial.length > 1) {
        direction = initial[0];
        value = value.replace(direction + "-", "");
    }


    if (value) {
        initial = value.split('/');
    }

    var location_name_type = '';
    var broad1_name_type = '';
    var broad2_name_type = '';

    if (initial !== '') {
        location_name_type = initial[0];
        broad1_name_type = initial[1];
        broad2_name_type = initial[2];

    }

    var tmp = location_name_type.split('(');
    var location_name = "";
    var location_type = "";


    if (tmp) {
        location_name = tmp[0];
        if (tmp[1]) {
            location_type = tmp[1].replace(')', '');
        }
    }
    var broad1_name = "";
    var broad1_type = "";


    if (broad1_name_type) {
        tmp = broad1_name_type.split('(');
        if (broad1_name_type) {
            broad1_name = tmp[0];
            if (tmp[1]) {
                broad1_type = tmp[1].replace(')', '');
            }
        }
    }

    var broad2_name = "";
    var broad2_type = "";
    if (broad2_name_type) {
        tmp = broad2_name_type.split('(');
        if (broad2_name_type) {
            broad2_name = tmp[0];
            if (tmp[1]) {
                broad2_type = tmp[1].replace(')', '');
            }
        }

    }

    location['direction'] = direction;
    location['source_name'] = location_name;
    location['location_type'] = location_type;
    location['broad1_name'] = broad1_name;
    location['broad1_type'] = broad1_type;
    location['broad2_name'] = broad2_name;
    location['broad2_type'] = broad2_type;

    return location;

}


////////////////////////////////////////////////////////////////////////////////

var orgs_json = new Object();
var orgs_tbl = new Object();

function handle_organizations(value, tbl_name, row, col, local_storage_lbl) {

    var orgs = new Object();
    var tmp = new Object();
    value = value.trim();
    value = value.replace("^^", "&");
    
    tmp['name'] = value;

    orgs['row_' + row] = Object.assign({}, orgs['row_' + row], tmp);
    orgs_tbl[tbl_name] = Object.assign({}, orgs_tbl[tbl_name], orgs);

    orgs_json[recordId] = Object.assign({}, orgs_json[recordId], orgs_tbl);

    localStorage.setItem(local_storage_lbl, JSON.stringify(orgs_json));
}



////////////////////////////////////////////////////////////////////////////////

var locs_json = new Object();

function handle_locations(value, table_id, row, col, local_storage_lbl, locs) {
    var tbl = new Object();
    var vals = new Object();

	if(value !== "[object Window]"){
    var location = parse_location(value);

    vals['direction'] = location.direction;
    vals['location_name'] = location.source_name;
    vals['vernacular'] = location.source_name;
    vals['type'] = location.location_type;
    vals['broader_name_1'] = location.broad1_name;
    vals['broader_type_1'] = location.broad1_type;
    vals['broader_name_2'] = location.broad2_name;
    vals['broader_type_2'] = location.broad2_type;

    var key = '';
    if (location.source_name) {
        key = location.source_name;
        if (location.location_type) {
            key = key + '(' + location.location_type + ')';
            if (location.broad1_name) {
                key = key + '/' + location.broad1_name;
            }
        }
    }

    if ((key.indexOf("&nbsp;") < 0) && (key.indexOf("\n") < 0) && key !== '') {

        var tmp = new Object();
        tmp[key.toLowerCase().replace(/\s/g, "_")] = vals;

        locs['row_' + row] = Object.assign({}, locs['row_' + row], tmp);
        tbl[table_id] = Object.assign({}, tbl[table_id], locs);

        locs_json[recordId] = Object.assign({}, locs_json[recordId], tbl);
        localStorage.setItem(local_storage_lbl, JSON.stringify(locs_json));
    }
	}
}
;

////////////////////////////////////////////////////////////////////////////////
function handle_odessa_locations(json, table_label, local_storage_lbl, source_locs) {

    if (json) {
        $.each(json, function (cnt) {
            $.each(this, function (row) {

                // first place ///////////////////////////////////////////////////  
                var village = '';
                if (this['person_birth_village']) {
                    village = this['person_birth_village'] + '(village)';
                }
                var city = '';
                if (this['person_birth_city']) {
                    city = '/' + this['person_birth_city'] + '(city)';
                }
                var township = '';
                if (this['person_birth_township']) {
                    township = '/' + this['person_birth_township'] + '(township)';
                }
                var district = '';
                if (this['person_birth_district']) {
                    district = '/' + this['person_birth_district'] + '(district)';
                }
                var governorate = '';
                if (this['person_birth_governorate']) {
                    governorate = '/' + this['person_birth_governorate'] + '(governorate)';
                }
                var country = '';
                if (this['person_birth_country']) {
                    country = '/' + this['person_birth_country' + '(country)'];
                }


                var result;

                result = village + city + township + district + governorate + country;

                if (result[0] === '/') {
                    result = result.replace(result[0], '');
                }
                if (result) {
                    handle_locations(result, table_label + cnt, row, null, 'LOCS', source_locs);
                    //handle_locations(result,table_label + cnt ,row,null,'LOCS',source_locs); 
                }
                // 2nd place ///////////////////////////////////////////////////

                var village = '';
                if (this['person_registration_village']) {
                    village = this['person_registration_village'] + '(village)';
                }
                var city = '';
                if (this['person_registration_city']) {
                    city = '/' + this['person_registration_city'] + '(city)';
                }
                var township = '';
                if (this['person_registration_township']) {
                    township = '/' + this['person_registration_township'] + '(township)';
                }
                var district = '';
                if (this['person_registration_district']) {
                    district = '/' + this['person_registration_district'] + '(district)';
                }
                var governorate = '';
                if (this['person_registration_governorate']) {
                    governorate = '/' + this['person_registration_governorate'] + '(governorate)';
                }
                var country = '';
                if (this['person_registration_country']) {
                    country = '/' + this['person_registration_country' + '(country)'];
                }

                var result2;
                result2 = village + city + township + district + governorate + country;

                if (result2[0] === '/') {
                    result2 = result2.replace(result2[0], '');
                }
                if (result2) {
                    handle_locations(result2, table_label + cnt, row, null, 'LOCS', source_locs);
                    //handle_locations(result2,table_label + cnt ,row,null,local_storage_lbl,source_locs); 
                }
                // 3rd place ///////////////////////////////////////////////////
                var village = '';

                if (this['person_residense_village']) {
                    village = this['person_residense_village'] + '(village)';
                }
                var city = '';
                if (this['person_residense_city']) {
                    city = '/' + this['person_residense_city'] + '(city)';
                }
                var township = '';
                if (this['person_residense_township']) {
                    township = '/' + this['person_residense_township'] + '(township)';
                }
                var district = '';
                if (this['person_residense_district']) {
                    district = '/' + this['person_residense_district'] + '(district)';
                }
                var governorate = '';
                if (this['person_residense_governorate']) {
                    governorate = '/' + this['person_residense_governorate'] + '(governorate)';
                }
                var country = '';
                if (this['person_residense_country']) {
                    country = '/' + this['person_residense_country' + '(country)'];
                }


                var result3;

                result3 = village + city + township + district + governorate + country;

                if (result3[0] === '/') {
                    result3 = result3.replace(result[0], '');
                }
                if (result) {
                    handle_locations(result3, table_label + cnt, row, null, 'LOCS', source_locs);
                    //handle_locations(result3,table_label + cnt ,row,null,local_storage_lbl,source_locs); 
                }

            });


        });

    }


}
;

////////////////////////////////////////////////////////////////////////////////
function handle_payroll_ru_locations(json, table_label, local_storage_lbl, source_locs) {

    if (json) {
        $.each(json, function (row) {

            // first place ///////////////////////////////////////////////////                                             
            var village = '';
            if (this['payroll_person_village']) {
                village = this['payroll_person_village'] + '(village)';
            }
            var city = '';
            if (this['payroll_person_city']) {
                city = '/' + this['payroll_person_city'] + '(city)';
            }
            var township = '';
            if (this['payroll_person_township']) {
                township = '/' + this['payroll_person_township'] + '(township)';
            }
            var district = '';
            if (this['payroll_person_district']) {
                district = '/' + this['payroll_person_district'] + '(district)';
            }
            var governorate = '';
            if (this['payroll_person_governorate']) {
                governorate = '/' + this['payroll_person_governorate'] + '(governorate)';
            }
            var country = '';
            if (this['payroll_person_country']) {
                country = '/' + this['payroll_person_country' + '(country)'];
            }
            var result;

            result = village + city + township + district + governorate + country;

            if (result[0] === '/') {
                result = result.replace(result[0], '');
            }


            if (result) {
                handle_locations(result, table_label, row, null, local_storage_lbl, source_locs);
            }
            // 2nd place ///////////////////////////////////////////////////                                                           
            var village = '';
            if (this['payroll_issuing_village']) {
                village = this['payroll_issuing_village'] + '(village)';
            }
            var city = '';
            if (this['payroll_issuing_city']) {
                city = '/' + this['payroll_issuing_city'] + '(city)';
            }
            var township = '';
            if (this['payroll_issuing_township']) {
                township = '/' + this['payroll_issuing_township'] + '(township)';
            }
            var district = '';
            if (this['payroll_issuing_district']) {
                district = '/' + this['payroll_issuing_district'] + '(district)';
            }
            var governorate = '';
            if (this['payroll_issuing_governorate']) {
                governorate = '/' + this['payroll_issuing_governorate'] + '(governorate)';
            }
            var country = '';
            if (this['payroll_issuing_country']) {
                country = '/' + this['payroll_issuing_country' + '(country)'];
            }

            var result2;
            result2 = village + city + township + district + governorate + country;

            if (result2[0] === '/') {
                result2 = result2.replace(result2[0], '');
            }
            if (result2) {
                handle_locations(result2, table_label, row, null, local_storage_lbl, source_locs);
            }
        });

    }


}
;



////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
///////////////////////////INSTANCE MATCHING TO DO
////////////////////////////////////////////////////////////////////////////////

/////////////////////////////SHIPS///////////////////////////////////
var ships_json = new Object();

function handle_ships(row, col, value, tbl_name, cols, lbls, local_storage_lbl, ships, ships_tbl) {


   var vals = "";
    if (value) {
        vals = value.split(/\n/);
    }
    if ($(vals).size() > 1) {
        $.each(vals, function (i) {
            var tmp = new Object();
            var pos = jQuery.inArray(col, cols);

            if (pos !== -1) {
                tmp[lbls[pos]] = this;
            }

            ships['row_' + row + '_' + i] = Object.assign({}, ships['row_' + '_' + row + i], tmp);
            ships_tbl[tbl_name] = Object.assign({}, ships_tbl[tbl_name], ships);

            ships_json[recordId] = Object.assign({}, ships_json[recordId], ships_tbl);
            localStorage.setItem(local_storage_lbl, JSON.stringify(ships_json));


        });
    } else {
        if (value && (value !== null) && (value !== "")) {
            value = value.trim();
            var tmp = new Object();
            var pos = jQuery.inArray(col, cols);

            if (pos !== -1) {
                tmp[lbls[pos]] = value;
            }

            ships['row_' + row] = Object.assign({}, ships['row_' + row], tmp);
            ships_tbl[tbl_name] = Object.assign({}, ships_tbl[tbl_name], ships);

            ships_json[recordId] = Object.assign({}, ships_json[recordId], ships_tbl);
            localStorage.setItem(local_storage_lbl, JSON.stringify(ships_json));

        }
} 
}
;

///////////////////////////////PERSONS//////////////////////////////////
var persons_json = new Object();

function handle_persons(row, col, value, tbl_name, cols, lbls, persons, tbl, local_storage_lbl) {


    if (value && (value !== null) && (value !== "")) {
        value = value.trim();

        var tmp = new Object();
        var pos = jQuery.inArray(col, cols);

        if (pos !== -1) {
            tmp[lbls[pos]] = value;
        }

        persons['row_' + row] = Object.assign({}, persons['row_' + row], tmp);
        tbl[tbl_name] = Object.assign({}, tbl[tbl_name], persons);

        persons_json[recordId] = Object.assign({}, persons_json[recordId], tbl);
        localStorage.setItem(local_storage_lbl, JSON.stringify(persons_json));

    }
}
;


////////////////////////////////////////////////////////////////////////////////
/////////////////////////////CREATE Insta MODAL///////////////////////////////////////

$('#mark_as_same_btn').click(function () {

    var term = $('#initial_term').text();
    var synonym = $('[data-id=insert_insta_terms]').attr('title');
    var comment = $('#same_insta_comment').val();


    $("#same_instance_Modal").modal('hide');
});

function create_same_insta_modal(vocab_label, value) {

    $('#insert_insta_terms').empty();
    $("#initial_term").empty();
    $("#same_insta_comment").val('');
    $("#initial_term").append(value);

    var options = [];
    var term = JSON.parse(localStorage.getItem(vocab_label));

    $.each(term, function (i) {
        var option = "<option>" + term[i] + "</option>";
        if (term[i] !== value) {
            options.push(option);
        }
    });

    $('.selectpicker').html(options);
    $('.selectpicker').selectpicker('refresh');
    $("#same_instance_Modal").modal('show');
}
;



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////  VOCABULARIES   ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////MAXIFY OCCURENCIES//////////////////////////////////
function maxify_occurencies(occs) {

    var real_occs = new Array();

    $.each(occs, function () {
        if ((this.row).length) {
            var occ = this;
            var rows = (this.row).split(',');
            $.each(rows, function (j) {
                var tmp = new Object();
                tmp['tableVariable'] = occ.tableVariable;
                tmp['table'] = occ.table;
                tmp['row'] = parseInt(this) - 1;
                tmp['col'] = parseInt(occ.col);
                tmp['fieldTitle'] = occ.fieldTitle;
                real_occs.push(tmp);
            });
        } else {
            var tmp1 = new Object();
            tmp1['tableVariable'] = this.tableVariable;
            tmp1['table'] = this.table;
            tmp1['row'] = parseInt(this.row) - 1;
            tmp1['col'] = parseInt(this.col);
            tmp1['fieldTitle'] = this.fieldTitle;
            real_occs.push(tmp1);
        }
    });

    return real_occs;
}
;

////////////////////////////////////////////////////////////////////////////////
// Create new terms and adds them into vocabularies (local storage) dynamically
////////////////////////////////////////////////////////////////////////////////

function handle_vocabulary(celldata, label, src) {
    var val = celldata;

    var lmnts = new Array();
    lmnts = JSON.parse(localStorage.getItem(label));

    if (lmnts == null) {
        lmnts = [];
    }
    if (typeof val !== "undefined" && val !== null) {
        var newline = val.indexOf("\n");
        if (!(newline > -1)) {
            if (val !== "&nbsp;") {
                lmnts.push(val);
            }
        }
    }

    ($.grep(lmnts, function (n) {
        return n == 0 || n;
    }));
    var uniqueArray = lmnts.filter(function (item, pos) {
        return lmnts.indexOf(item) == pos;
    });

    src.source = $.grep(uniqueArray, function (n) {
        return n == 0 || n;
    });


//    src.source = (src.source).filter(val = > Object.keys(val).length !== 0);
//Changed to this form. Needs testing
    src.source = (src.source).filter(
            function (val) {
                return Object.keys(val).length !== 0;
            });

    localStorage.setItem(label, JSON.stringify(src.source));
}
;

//////////////////////////////Create vocab json/////////////////////////////////

var terms_json = new Object();

function handle_json_vocs(value, label, row, col, col_no, table_id, terms) {

    if (value && (value !== null) && (value !== "")) {
        var tmp = new Object();
        var vals = new Object();

        value = value.trim();
        value = value.replace("^^", "&");
        var values = new Object();


        if (value.indexOf("\n") > 0) {
            values = value.split("\n");

            $.each(values, function () {

                vals['term'] = this;
                vals['label'] = label;
                vals['row'] = row;
                vals['col'] = col;
                vals['col_no'] = col_no;

                tmp[this.toLowerCase().replace(/\s/g, "_")] = vals;
                terms['row_' + row] = Object.assign({}, terms['row_' + row], tmp);

            });
        } else {
            vals['term'] = value.toString();
            vals['label'] = label;
            vals['row'] = row;
            vals['col'] = col;
            vals['col_no'] = col_no;

            tmp[value.toLowerCase().replace(/\s/g, "_")] = vals;
            terms['row_' + row] = Object.assign({}, terms['row_' + row], tmp);
        }
        terms_json[table_id] = Object.assign({}, terms_json[table_id], terms);
    }
}
;

//////////////////////////////USED TERMS ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//////////////////////Edit Used terms in local storage AND from Record /////////
////////////////////////////////////////////////////////////////////////////////

function edit_used_Voc_Term(label, term, location) {

    myVocabsDB_local.get(label).then(function (vocab) {

        var row = $(location).parent().parent();
        term = unescape(term);
        var edit_value = term;


        if (($(row).find('input').length) === 0) {

            if ($(row).find('span').length < 1) {
                edit_value = ($(row).find('div').val());
            }

            // edit on edit problem handle
            if ($(row).find('.not_edited').length < 1) {
                var tmp = row;
                $(tmp).find('span').remove();
                edit_value = $(tmp).find('td').first().html();
            }


            var clean_id = edit_value.replace(/ /g, "_");
            clean_id = clean_id.replace(/[`()&_|+\-=?;:!'",.<>\{\}\[\]\\\/]/gi, '_');

            var html = "<input style='width:65%;' id='" + clean_id + "'/><button style='border-width:0px; margin: 0px 0px 0px 5px; height:22px;'  type='button' id='done_edit_" + clean_id + "' class='btn btn-xs btn-outline-secondary'>Confirm</button>";

            $(row).find('.txt_value').text('');
            $(row).find('.txt_value').append(html);

            $('#' + clean_id).val(edit_value);

            $('#done_edit_' + clean_id).click(function () {

                var new_value = $('#' + clean_id).val();
                $(row).find('.txt_value').text(new_value);

                var local_storage = JSON.parse(localStorage.getItem(label));
                $.each(local_storage, function (key, val) {
                    local_storage[key] = val.replace(edit_value, new_value);
                });


                localStorage.setItem(label, JSON.stringify(local_storage));
                var occurencies = vocab.terms[term.toLowerCase()].usage[recordId].occurences;

                update_Cells(occurencies, "edit", new_value, edit_value);

                var occs;
                $.each(occurencies, function () {
                    //var row  = parseInt(this.row) +1 ;
                    occs = occs + "<tr>" +
                            "<td style='text-align:center;'>" + $('#unique_filename').html() + "</td>" +
                            "<td style='text-align:center;'>" + this.table + "</td>" +
                            "<td style='text-align:center;'>" + this.fieldTitle + " (" + this.col + ")</td>" +
                            "<td style='text-align:center;'>" + this.row + "</td>" +
                            "</tr>";
                });

                var popover = "<span class='span12 pull-right'>" +
                        "<a  tabindex='0' role='button' data-trigger='focus' class='btn-sm' data-placement='right' id='" + clean_id + "'><i style='color:grey; margin-left:5px;' class='fa fa-info-circle' aria-hidden='true'/></a>" +
                        "<div id='" + clean_id + "iou' style='display: none; ' >" +
                        "  <div style='font-size:12px; '>" +
                        "    <table border='1' style='width:100%'>" +
                        "       <tr class style='background-color:#153544; color:#fff;'>" +
                        "          <th style='text-align:center;'>Record Title</th>" +
                        "          <th style='text-align:center;'>Table Name</th>" +
                        "          <th style='text-align:center;'>Field Title</th>" +
                        "          <th style='text-align:center;'>Row</th>" +
                        "       </tr>" +
                        occs +
                        "    </table>" +
                        " </div>" +
                        "</div>" +
                        "</span>";

                $(row).find('.txt_value').append(popover);

                $('#cleantermpiou').tooltip();
                $("#" + clean_id).popover({
                    html: true,
                    content: function () {
                        return $('#' + clean_id + 'iou').html();
                    }
                });

            });
        }
    });
}
;

////////////////////////////////////////////////////////////////////////////////
//////////////////////Remove Used terms from local storage AND from Records ////
////////////////////////////////////////////////////////////////////////////////

function remove_used_Voc_Term(label, term, location) {

    myVocabsDB_local.get(label).then(function (vocab) {

        term = unescape(term);

        var local_storage = JSON.parse(localStorage.getItem(label));
        local_storage = jQuery.grep(local_storage, function (value) {
            return value != term;
        });

        var row = $(location).parent().parent();
        var html = "<button style='border-width:0px; margin: 0px 0px 0px 5px; height:22px;' type='button' class='confirm_used_delete btn btn-xs btn-outline-secondary'>Confirm</button>" +
                "<button style='border-width:0px; margin: 0px 0px 0px 5px; height:22px;' type='button' class='cancel_used_delete btn btn-xs btn-outline-secondary'>Cancel</button>";

        $(row).find('.cancel_used_delete').remove();
        $(row).find('.confirm_used_delete').remove();
        $(row).find('div').append(html);

        $(row).find('.fa-info-circle').hide();

        $('.cancel_used_delete').click(function () {
            $(row).find('.fa-info-circle').show();
            $(row).find('.cancel_used_delete').remove();
            $(row).find('.confirm_used_delete').remove();
        });

        $('.confirm_used_delete').click(function () {
            localStorage.setItem(label, JSON.stringify(local_storage));
            var occurencies = vocab.terms[term.toLowerCase()].usage[recordId].occurences;
            update_Cells(occurencies, "remove", "", term);
            $(row).remove();
        });

    });
}
;

//////////////////////////////UNUSED TERMS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/////////////////////// Removes unused terms from Local storage/////////////////
////////////////////////////////////////////////////////////////////////////////

function remove_Voc_Term(location, local_storage_var) {

    var row = $(location).parent().parent();
    var remove_value = $(row).find('.txt_value').text();
    var local_storage = JSON.parse(localStorage.getItem(local_storage_var));

    local_storage = jQuery.grep(local_storage, function (value) {
        return value != remove_value;
    });

    localStorage.setItem(local_storage_var, JSON.stringify(local_storage));
    $(row).remove();

}
;

////////////////////////////////////////////////////////////////////////////////
////////////////////////Edit vocabulary terms///////////////////////////////////

function edit_Voc_Term(location, local_storage_var) {

    var row = $(location).parent().parent();
    var edit_value = $(row).find('.txt_value').text();

    if (($(row).find('input').length) === 0) {

        var clean_id = edit_value.replace(/ /g, "_");
        clean_id = clean_id.replace(/[`~!@#$%^&*()_|+\-=?;:!'",.<>\{\}\[\]\\\/]/gi, '_');

        var html = "<input style='width:60%;' id='" + clean_id + "' value = '" + edit_value.replace(/['"/]/gi, '`') + "' /><button style='border-width:0px; margin: 0px 0px 0px 5px; height:22px;'  type='button' id='done_edit_" + clean_id + "' class='btn btn-xs btn-outline-secondary'>Confirm</button>";

        $(row).find('.txt_value').text('');
        $(row).find('.txt_value').append(html);

        var local_storage = JSON.parse(localStorage.getItem(local_storage_var));

        $('#done_edit_' + clean_id).click(function () {
            var new_value = $('#' + clean_id).val();
            $(row).find('.txt_value').text(new_value);

            $.each(local_storage, function (key, val) {
                local_storage[key] = val.replace(edit_value, new_value);
            });

            localStorage.setItem(local_storage_var, JSON.stringify(local_storage));

        });
    }
}
;


////////////////////////REMOVE NOT USED TERMS////////////////////////////////

$('#remove_all_not_used').click(function () {
    var not_used_table = $('#not_used_vocabylary_terms');
    $.each($(not_used_table).find('.remove_voc'), function () {
        $(this).click();
    });
});

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////CREATE VOCABULARY MODAL////////////////////////////

function create_voc_modal(label, row, col) {
    //var term = JSON.parse(localStorage.getItem(label));    
    //console.log($('#not_used_vocabylary_terms').html())
    $('#add_new_term').empty();
    $('#vocabylary_terms').empty();
    $('#not_used_vocabylary_terms').empty();
    // $('#save_voc').remove();
    $('.span12').remove();

    //////////////local storage terms           
    var html = "";
    var new_term = "<input style='width:300px;' id='new_term_val' value = '' /><button style='margin:5px;' onclick='add_New_Term(\"" + label + "\");' class='btn btn-xs btn-outline-secondary' id='add_New'>Add New Term</button>";
    var html_not_used = "";

    ///////////////////////GIVE NAME TO MODAL
    var url_string = window.location.href;
    var url = new URL(url_string);
    var pp = unescape(url.pathname).replace('/FastCat/templates/', '');
    var template = pp.replace('.html', '');

    if (template.indexOf('/') > -1) {
        var tmp = template.split('/');
        template = tmp[tmp.length - 1];
    }
    ///////////////////////////////////////////
    // console.log(label)
    myVocabsDB_local.get(label).then(function (vocab) {

        $.each(vocab.terms, function () {
            var usage_keys = Object.keys(this.usage);
            //console.log(this)
            var term = this.value;

            ////// used terms
            if (usage_keys.length > 0) {

                var occs = "";
                $.each(this.usage, function (i) {
                    var title = this.title;

                    $.each(this.occurences, function () {
                        occs = occs + "<tr class='to_show'>" +
                                "<td style='text-align:center;'>" + title + "</td>" +
                                "<td style='text-align:center;'>" + this.table + "</td>" +
                                "<td style='text-align:center;'>" + this.fieldTitle + " (" + this.col + ")</td>" +
                                "<td style='text-align:center;'>" + this.row + "</td>" +
                                "</tr>";
                    });
                });

                var clean_term = term.replace(/ /g, '_');
                clean_term = clean_term.replace(/[`~!@#$%^&*()_|+\-=?;:!'",.<>\{\}\[\]\\\/]/gi, '_');

                var popover = "<span class='span12 pull-right'>" +
                        "<a  tabindex='0' role='button' data-trigger='focus' class='btn-sm' data-placement='right' id='" + clean_term + "'><i style='color:grey; margin-left:5px;' class='fa fa-info-circle' aria-hidden='true'/></a>" +
                        "<div id='" + clean_term + "piou' style='display: none; ' >" +
                        "  <div style='font-size:12px; '>" +
                        "    <table border='1' style='width:100%'>" +
                        "       <tr style='background-color:#153544; color:#fff;'>" +
                        "          <th style='text-align:center;'>Record Title</th>" +
                        "          <th style='text-align:center;'>Table Name</th>" +
                        "          <th style='text-align:center;'>Field Title</th>" +
                        "          <th style='text-align:center;'>Row Number</th>" +
                        "       </tr>" +
                        occs +
                        "    </table>" +
                        " </div>" +
                        "</div>" +
                        "</span>";

                if (jQuery.inArray(recordId, usage_keys) !== -1) {

                    if (usage_keys.length > 1) {
                        //if ((usage_keys.length == 1) && usage_keys[0] === recordId) {
                        html = html + "<tr><td style='vertical-align: middle;'  class='txt_value'>" +
                                "<div class='not_edited'>" + term + popover + "</div>" + // "<td>"+popover+"</td>"+ 
                                "</td><td><button style='margin:5px;'  onclick='remove_used_Voc_Term(\"" + label + "\",\"" + escape(term) + "\",this);' class='btn btn-xs btn-outline-secondary remove_voc' >Remove from Record</button></td><td><button style='margin:5px;' onclick='edit_used_Voc_Term(\"" + label + "\",\"" + escape(term) + "\",this);' class='btn btn-xs btn-outline-secondary edit_voc'>Edit in Record</button></td><tr>";
                    } else {
                        html = html + "<tr><td style='vertical-align: middle;'  class='txt_value'>" +
                                "<div class='not_edited' style='color:#4a86a2;' >" + term + popover + "</div>" +
                                "</td><td>" +
                                "<button style='margin:5px;'  onclick='remove_used_Voc_Term(\"" + label + "\",\"" + escape(term) + "\",this);' class='btn btn-xs btn-outline-secondary remove_voc' >Remove from Record</button></td><td><button style='margin:5px;' onclick='edit_used_Voc_Term(\"" + label + "\",\"" + escape(term) + "\",this);' class='btn btn-xs btn-outline-secondary edit_voc'>Edit in Record</button>" +
                                "</td><tr>";
                    }
                } else {
                    html = html + "<tr style='height:33px;'><td style='vertical-align: middle;'  class='txt_value'>" +
                            "<div>" + term + popover + "</div>" +
                            "</td><td><span></span></td><td></td><tr>";
                }
            }
            /////////// not used terms
            else {
                
                html_not_used = html_not_used + "<tr><td style='vertical-align: middle;'  class='txt_value'>" + term + "</td><td><button style='margin:5px;' onclick='remove_Voc_Term(this,\"" + label + "\");' class='btn btn-xs btn-outline-secondary remove_voc' >Remove</button></td><td><button style='margin:5px;' onclick='edit_Voc_Term(this,\"" + label + "\");' class='btn btn-xs btn-outline-secondary edit_voc'>Edit</button></td><tr>";
            }
        });

      
        ///////////GIVE NAME TO MODAL
        if (template) {
            templatesDB_local.get(template).then(function (result) {
                var vocab_label = "";
                $.each(result.vocabularies, function () {
                    if (this.id === label) {
                        vocab_label = this.label;
                    }
                });

                $('#modal_title').empty();
                $('#modal_title').append(vocab_label);
            });
        }
        //////////////////////////////////

        //    $('#button_save').append(btn_save);
        $('#add_new_term').append(new_term);
        $('#vocabylary_terms').append(html);
        $('#not_used_vocabylary_terms').append(html_not_used);
        $('[data-toggle="tooltip"]').tooltip();
        $("#edit_vocabulary_Modal").modal('show');

        $.each(vocab.terms, function () {
            var term = this.value;
            var clean_term = term.replace(/ /g, '_');
            clean_term = clean_term.replace(/[`~!@#$%^&*()_|+\-=?;:!'",.<>\{\}\[\]\\\/]/gi, '_');
            $("#" + clean_term).popover({
                html: true,
                content: function () {
                    return $('#' + clean_term + 'piou').html();
                }
            });
        });

    }).catch(function (err) {
       
        if (err.message === 'missing') {
            if (template) {
                templatesDB_local.get(template).then(function (result) {
                    var vocab_label = "";
                    $.each(result.vocabularies, function () {
                        if (this.id === label) {
                            vocab_label = this.label;
                        }
                    });
                    $('#modal_title').empty();
                    $('#modal_title').append(vocab_label);
                });
            }
            $("#edit_vocabulary_Modal").modal('show');
        }
    });
}
;
/////////////////////////////////////////////////////////////////////////////

function select_location_map() {


    var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    var source = new ol.source.Vector({wrapX: false});

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    var map = new ol.Map({
        layers: [raster, vector],
        target: 'map',
        view: new ol.View({
            center: [-11000000, 4600000],
            zoom: 4
        })
    });

    var typeSelect = document.getElementById('type');

    var draw; // global so we can remove it later
    function addInteraction() {
        var value = typeSelect.value;
        if (value !== 'None') {
            var geometryFunction, maxPoints;
            if (value === 'Square') {
                value = 'Circle';
                geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            } else if (value === 'Box') {
                value = 'LineString';
                maxPoints = 2;
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new ol.geom.Polygon(null);
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([
                        [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
                    return geometry;
                };
            }
            draw = new ol.interaction.Draw({
                source: source,
                type: /** @type {ol.geom.GeometryType} */ (value),
                geometryFunction: geometryFunction,
                maxPoints: maxPoints
            });
            draw.on('drawend', function (e) {

                alert(e.feature.getGeometry().getExtent());
            });
            map.addInteraction(draw);
        }
    }


    /**
     * Handle change event.
     */
    typeSelect.onchange = function () {
        map.removeInteraction(draw);
        addInteraction();
    };

    addInteraction();

}
;

////////////////////////////////////////////////////////////////////////////////

function create_location_modal(tableId, value, row, col, label) {

    myVocabsDB_local.get(label).then(function (vocab) {

        $('#location_title').text(value);
        $('#map').empty();
        $('#location_type').val("");
        $('#vernacular').val("");
        $('#tgn_id').empty();

        $('#broader_location_name_1').empty();
        $('#broader_location_tgn_1').empty();
        $('#broader_location_name_2').empty();
        $('#message').empty();
        $('#add_btn_here').empty();
        $('[data-toggle="tooltip"]').tooltip();

        var orginal_val = value;//.replace(/[[]]/g, '');

        var html = "<button onclick='add_loc_information(" + row + "," + col + ",\"" + tableId + "\",\"" + label + "\",\"" + value + "\");' style='margin:10px;' class='btn pull-right' id='add_info'>Add information</button>";
        $('#add_btn_here').append(html);


        var location = parse_location(value);

        $('#loc_direction').selectpicker('val', location.direction.toLowerCase());
        $('#name_id').val(location.source_name);
        $('#vernacular').val(location.source_name);
        $('#loc_type').selectpicker('val', location.location_type.toLowerCase());
        $('#broader_location_name_1').val(location.broad1_name);
        $('#broader1_type').selectpicker('val', location.broad1_type.toLowerCase());
        $('#broader_location_name_2').val(location.broad2_name);
        $('#broader2_type').selectpicker('val', location.broad2_type.toLowerCase());



        if (vocab.terms[orginal_val]) {

            if (vocab.terms[orginal_val].pref_name) {
                $('#pref_name_id').val(vocab.terms[orginal_val].pref_name);
            } else {
                $('#pref_name_id').val('');
            }

            if (vocab.terms[orginal_val].vernacular) {
                $('#vernacular').val(vocab.terms[orginal_val].vernacular);
            } else {
                $('#vernacular').val('');
            }

            if (vocab.terms[orginal_val].tgn_id) {
                $('#tgn_id').val(vocab.terms[orginal_val].tgn_id);
            } else {
                $('#tgn_id').val('');
            }
            if (vocab.terms[orginal_val].broader1_tgn_id) {
                $('#broader_location_tgn_1').val(vocab.terms[orginal_val].broader1_tgn_id);
            } else {
                $('#broader_location_tgn_1').val('');
            }
            if (vocab.terms[orginal_val].broader2_tgn_id) {
                $('#broader_location_tgn_2').val(vocab.terms[orginal_val].broader2_tgn_id);
            } else {
                $('#broader_location_tgn_2').val('');
            }

        }
        $("#location_Modal").modal('show');
    });


}
;

/////////////////////////////////////////////////////////////////////////////////

function create_cell_location_value(label, value) {

    var direction = $('#loc_direction').val();
    if (direction) {
        direction = direction + '-';
    } else {
        direction = '';
    }

    var name = $('#name_id').val();
    var location_type = $('#loc_type').val();

    if (location_type) {
        location_type = '(' + location_type + ')';
    } else {
        location_type = '';
    }

    var tgn_id = $('#tgn_id').val();



    var brod1_name = $('#broader_location_name_1').val();

    if (brod1_name) {
        brod1_name = '/' + brod1_name;
    } else {
        brod1_name = '';
    }

    var brod1_type = $('#broader1_type').val();
    if (brod1_type) {
        brod1_type = '(' + brod1_type + ')';
    } else {
        brod1_type = '';
    }
    var brod1_tgn = $('#broader_location_tgn_1').val();
    var brod2_name = $('#broader_location_name_2').val();

    if (brod2_name) {
        brod2_name = '/' + brod2_name;
    } else {
        brod2_name = '';
    }


    var brod2_type = $('#broader2_type').val();
    if (brod2_type) {
        brod2_type = '(' + brod2_type + ')';
    } else {
        brod2_type = '';
    }
    var brod2_tgn = $('#broader_location_tgn_2').val();
    var comment = $('#message').val();

    var result = direction + name + location_type + brod1_name + brod1_type + brod2_name + brod2_type;

     myVocabsDB_local.get(label).then(function (vocab) {

        var locations = vocab['locations'];

        console.log(vocab)
        console.log(locations)

        var oo = new Object();
        var tmp = new Object();

        oo = Object.assign({}, JSON.parse(localStorage.getItem("LOCS")), oo);

        tmp['direction'] = $('#loc_direction').val();
        tmp['location_name'] = $('#name_id').val();

        if ($('#vernacular').val()) {
            tmp['vernacular'] = $('#vernacular').val();
        } else {
            tmp['vernacular'] = $('#name_id').val();
        }
        tmp['type'] = $('#loc_type').val();
        tmp['value'] = result;

        tmp['broader_name_1'] = $('#broader_location_name_1').val();

        tmp['tgn_id'] = $('#tgn_id').val();
        tmp['preferred_tgn_id'] = $('#preferred_tgn_id').val();
        tmp['broader_type_1'] = $('#broader1_type').val();
        tmp['broader_name_2'] = $('#broader_location_name_2').val();
        tmp['broader_type_2'] = $('#broader2_type').val();




        if (vocab.terms[value]) {
            vocab.terms[value]['vernacular'] = $('#vernacular').val();
            myVocabsDB_local.put(vocab).then(function (response) {
            });
        }

  
        var key = "";
        if ($('#tgn_id').val()) {
            key = $('#tgn_id').val();
            if ($('#preferred_tgn_id').val()) {
                key = key + '_' + $('#preferred_tgn_id').val();
            }
        } else if ($('#vernacular').val()) {
            key = $('#vernacular').val();
            if ($('#loc_type').val()) {
                key = key + '(' + $('#loc_type').val() + ')/' + $('#broader1_name').val();
            }
        } else if ($('#name_id').val()) {
            key = $('#name_id').val();
            if ($('#loc_type').val()) {
                key = key + '(' + $('#loc_type').val() + ')/' + $('#broader1_name').val();
            }
        }

        oo[key.toLowerCase()] = tmp;
        localStorage.setItem("LOCS", JSON.stringify(oo));

    });

    return result;

}
;

////////////////////////////////////////////////////////////////////////////


////////////////////////ADD NEW TERM////////////////////////////////////////

function add_New_Term(local_storage_var) {

    var local_storage = JSON.parse(localStorage.getItem(local_storage_var));
    var new_term = ($('#new_term_val').val());
    local_storage.push(new_term);
    var tbl = "<tr><td style='vertical-align: middle;'  class='txt_value'>" + new_term + "</td><td><button style='margin:5px;' onclick='remove_Voc_Term(this,\"" + local_storage_var + "\");' class='btn btn-xs btn-outline-secondary' id='remove_voc'>Remove</button></td><td><button style='margin:5px;' onclick='edit_Voc_Term(this,\"" + local_storage_var + "\");' class='btn btn-xs btn-outline-secondary' id='edit_voc'>Edit</button></td><tr>";
    $('#not_used_vocabylary_terms').prepend(tbl);

    localStorage.setItem(local_storage_var, JSON.stringify(local_storage));

}
;

//////////////////////////IMPORT EXPORT SCRIPTS/////////////////////////////////

function createJson(source, source_cols, usage) {

    // usage='excel';

    var raw_data = source.getData();
    var json = new Object();
    var label = new Array();
    var data = new Array();

    $.each(source_cols, function () {
        label.push(this.data);
    });
    /////// Multi Row Array
    if ((raw_data.length) > 2) {

        var result = new Object();
        $.each(raw_data, function (i, v) {
            var row = new Object();
            var row_data = new Array();
            $.each(raw_data[i], function (i2, v2) {
//              DO NOT SAVE NULLS unless export to excel
                if ((raw_data[i][i2]) || (usage === 'excel')) {
                    if (raw_data[i][i2] === null) {
                        row_data.push("");
                        row[label[i2]] = "";
                    } else {
                        row_data.push(raw_data[i][i2].replace(/&nbsp;/gi, ' ').replace(/["']/gi, '`').replace(/[&]/gi, '^^').replace(/[<>]/gi, '_'));
                        row[label[i2]] = raw_data[i][i2].replace(/&nbsp;/gi, ' ').replace(/["']/gi, '`').replace(/[&]/gi, '^^').replace(/[<>]/gi, '_');
                    }
                }
            });
            result[i] = row;
        });
        json = result;
    }
    /// One Row Array
    else {
        $.each(raw_data, function () {
            for (var i = 0; i < this.length; i++) {
                data.push(this[i]);
            }
        });

        for (var i = 0; i < label.length; i++) {
            if (data[i] === null) {
                json[label[i]] = "";
            } else {
                json[label[i]] = data[i].replace(/&nbsp;/gi, ' ').replace(/["']/gi, '`').replace(/[&]/gi, '^^').replace(/[<>]/gi, '_');
            }
        }
    }
    return json;
}
;


//////////////Create Record Json Saved to the DataBase/////////////////


$('#create').click(function () {

    //console.log(record_status)              
    // loading modal
    var json;
    if (record_status === 'Public') {
        
        $("#exporting_modal").find('#exported_text').text('');
        $("#exporting_modal").find('#progress_number').attr('style', "width: 0%");
        $("#exporting_modal").modal('show');
        // $('#exporting_modal').on('shown.bs.modal', function () {
        json = createRecordJson();
        putDB(json);
     
    } else {
        json = createRecordJson();
        putDB(json);
    }
    saved = true;
});



//////////////////////EXPORT TO XML///////////////////////


$('#xml_export').click(function () {

    var textFile = null;
    var makeTextFile = function (text) {
        var data = new Blob([text], {type: 'text/plain'});
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };

//    var xml;
    $("#exporting_modal").modal('show');
    $('#exporting_modal').on('shown.bs.modal', function () {
        var xml = create_xml_file();
        $("#exporting_modal").modal('hide');
        var link = document.getElementById('downloadlink');
        var filename = $('#unique_filename').text();
        $('#downloadlink').attr('download', filename + '.xml');
        link.href = makeTextFile(xml);
        link.click();
        $(this).off('shown.bs.modal');
    });

});

function download_backup_json() {

    var backup_json = new Object();

    backup_json['_id'] = recordId;
    backup_json['template'] = template;
    backup_json['data'] = createRecordJson();

    var textFile = null;
    var makeTextFile = function (text) {
        var data = new Blob([text], {type: 'text/plain'});
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };

    var link = document.getElementById('download_on_save');
    var filename = $('#unique_filename').text();
    $('#download_on_save').attr('download', filename + '.json');
    link.href = makeTextFile(JSON.stringify(backup_json));
    link.click();
}
;



////////////////////////////////////////////////////////////////////////////////
///////////////////////// change group structure///////////////////////////////

function normalize_group(group, group_No) {

    var length = 0;
    $.each(group, function (k) {
        var col = this;
        $.each(col, function (k) {
            if (this.constructor === Object) {
                length = Object.keys(this).length;
            }
        });
    });


    var groupaki = new Object();
    if (length > 0) {
        for (var i = 0; i < length; i++) {
            $.each(group, function () {
                var tmp = new Object();
                $.each(this, function (k) {
                    if ((this[k + '_' + i])) {
                        tmp[k] = (this[k + '_' + i]);
                    } else {
                        tmp[k] = '';
                    }
                });
                groupaki['group_data_' + i] = tmp;
            });
        }
    } else {
        $.each(group, function () {
            var tmp = new Object();
            $.each(this, function (k) {
                tmp[k] = (this.valueOf());
            });
            groupaki['group_data_0'] = tmp;
        });

    }

    var groupara = new Object();
    groupara['groups_' + group_No] = groupaki;
    return groupara;
}
;
////////////////////////////////////////////////////////////////////////////////
///////////////////////////// create groups structure and add it in rows ///////

function create_Group(nested_data, groups, columns, nested_label) {

    var result = new Object();
    var tmp_result = new Object();

    if (nested_data[nested_label]) {
        $.each(nested_data, function () {
            var row_data = this;

            $.each(row_data, function (row) {

                if (groups === null) {
                    tmp_result[row] = this;//Object.assign({}, tmp_result[row], this);
                } else {
                    $.each(groups, function (group_No) {
                        var multiple_vals = new Object();
                        for (var col = this[0]; col < this[1] + 1; col++) {
                            var value = row_data[row][columns[col].data];
                            if ((value).indexOf("\n") > 0) {
                                multiple_vals[columns[col].data] = (value).split("\n");
                            } else {
                                multiple_vals[columns[col].data] = (value);
                            }
                        }

                        var vals = new Object();
                        $.each(multiple_vals, function (k) {
                            var tmp = new Object();
                            if (this.length > 0 && this.constructor === Array) {
                                for (var i = 0; i < this.length; i++) {
                                    tmp[k + '_' + i] = this[i];
                                }

                                vals[k] = tmp;

                            } else {
                                vals[k] = (this.valueOf());
                            }
                        });

                        var group = new Object();
                        group['group_' + group_No] = vals;
                        tmp_result[row] = Object.assign({}, tmp_result[row], normalize_group(group, group_No));
                    });
                }

            });

            $.each(nested_data, function () {
                var row_data = this;
                $.each(row_data, function (row) {
                    var thiz = this;
                    ///////////remove duplicates                                            
                    if (groups !== null) {
                        $.each(groups, function (cnt) {
                            for (var i = this[0]; i < this[1] + 1; i++) {
                                delete thiz[columns[i].data];
                            }
                        });
                    }
                    tmp_result[row] = Object.assign({}, this, tmp_result[row]);
                });
            });
            result[nested_label] = tmp_result;
        });
        return result;
    } else {
        return null;
    }
}
;
////////////////////////////////////////////////////////////////////////////////
function merge_Groups_Nested(nested_groups, simple_groups, simpleGroups, label, cols) {

    var result = new Object();

    $.each(simple_groups, function (voyage) {
        $.each(this, function (key) {
            if (key.indexOf('groups_') < 0) {
                delete simple_groups[voyage][key];
            }
        });
    });

    $.each(nested_groups, function (voyage) {
        result[voyage] = Object.assign({}, nested_groups[voyage], simple_groups['row_' + voyage.replace(label, '')]);
        $.each(simpleGroups, function () {
            for (var i = this[0]; i < this[1] + 1; i++) {
                delete result[voyage][cols[i].data];
            }
        });
    });

    return result;
}
////////////////////////////////////////////////////////////////////////////////
///////////////////// 
function nested_with_Groups(json1, json2, groups, columns, nested_label, row_label, parent_cols) {

    var contents_row = new Object();
    $.each(json1, function (cnt) {
        var contents = new Object();
        $.each(this, function (row) {
            contents['row_' + row] = this;
        });

        contents_row['nested_table_' + cnt] = contents;
    });

    var nested_content = new Object();

    $.each(json2, function (cnt) {
        var row_data = new Object();
        if (contents_row['nested_table_' + cnt]) {
            row_data[nested_label] = contents_row['nested_table_' + cnt];
        }

        var grouped = (create_Group(row_data, groups, columns, nested_label));
        nested_content[row_label + cnt] = Object.assign({}, this, grouped);

    });

    return nested_content;

}
;

////////////////////////////////////////////////////////////////////////////////

///////////////////// 
function simple_with_Groups(json, groups, columns) {

    var row_data = new Object();

    $.each(json, function (row) {
        row_data['row_' + row] = this;
    });


    var result = new Object();

    $.each(row_data, function (row) {

        $.each(groups, function (group_No) {
            var multiple_vals = new Object();
            for (var col = this[0]; col < this[1] + 1; col++) {
                var value = row_data[row][columns[col].data];
            
            if(value){    
                if ((value).indexOf("\n") > -1) {
                    multiple_vals[columns[col].data] = (value).split("\n");
                } else {
                    multiple_vals[columns[col].data] = (value);
                }
            }
        }

            var vals = new Object();
            $.each(multiple_vals, function (k) {
                var tmp = new Object();
                if (this.length > 0 && this.constructor === Array) {
                    for (var i = 0; i < this.length; i++) {
                        tmp[k + '_' + i] = this[i];
                    }
                    vals[k] = tmp;
                } else {
                    vals[k] = (this.valueOf());
                }
            });
            var group = new Object();
            group['group_' + group_No] = vals;
            result[row] = Object.assign({}, result[row], normalize_group(group, group_No));
        });

    });

    $.each(row_data, function (row) {
        var thiz = this;
        ///////////remove duplicates                    
        $.each(groups, function (cnt) {
            for (var i = this[0]; i < this[1] + 1; i++) {
                delete thiz[columns[i].data];
            }
        });
        result[row] = Object.assign({}, this, result[row]);
    });

    return result;

}
;
///////////////////////////////////////////////////////////////////////////////
function oneRow_with_Groups(json, groups, columns) {

    $.each(json, function () {

        $.each(groups, function (group_No) {
            var multiple_vals = new Object();
            for (var col = this[0]; col < this[1] + 1; col++) {
                var value = json[columns[col].data];

                if ((value).indexOf("\n") > 0) {
                    multiple_vals[columns[col].data] = (value).split("\n");
                } else {
                    multiple_vals[columns[col].data] = (value);
                }
            }

            var vals = new Object();

            $.each(multiple_vals, function (k) {
                var tmp = new Object();
                if (this.length > 0 && this.constructor === Array) {
                    for (var i = 0; i < this.length; i++) {
                        tmp[k + '_' + i] = this[i];
                    }
                    vals[k] = tmp;
                } else {
                    vals[k] = (this.valueOf());
                }
            });
            var group = new Object();
            group['group_' + group_No] = vals;
            json = Object.assign({}, json, normalize_group(group, group_No));
        });
    });

    ///////////remove duplicates                    
    $.each(groups, function (cnt) {
        for (var i = this[0]; i < this[1] + 1; i++) {
            delete json[columns[i].data];
        }
    });

    return json;
}
;
///////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}


/////////////////////////////Load File////////////////////////////////////////
$('#loadfile').click(function () {

    $("#text_Modal").modal('show');

    document.getElementById('import').onclick = function () {

        var files = document.getElementById('selectFiles').files;
        if (files.length <= 0) {
            $("#text_Modal").modal('hide');
            return false;
        }

        var fr = new FileReader();
        var mime = (files[0].name).split(".").pop();

        fr.onload = function (e) {
            // console.log(e);
            var data;
            if (mime == 'json') {
                data = JSON.parse(e.target.result);
            } else if (mime == 'xml') {
                // var xml = e.target.result;
                //console.log(xml2json(xml))
            } else {
                console.log('Invalid format')
                alert('Invalid Format')
                $("#text_Modal").modal('hide');
                return;
            }
            load(data);
        };
        fr.readAsText(files.item(0));
        $("#text_Modal").modal('hide');
    };

});


///////////////////////////XML TO JSON//////////////////////////////////////////

function xml2json(xml, tab) {
    var X = {
        toObj: function (xml) {
            var o = {};
            if (xml.nodeType == 1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i = 0; i < xml.attributes.length; i++)
                        o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0, cdataChild = 0, hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1)
                            hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/))
                            textChild++; // non-whitespace text
                        else if (n.nodeType == 4)
                            cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                } else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        } else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    } else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    } else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild)
                    o = null;
            } else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            } else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function (o, name, ind) {
            var json = name ? ("\"" + name + "\"") : "";
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++)
                    o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            } else if (o == null)
                json += (name && ":") + "null";
            else if (typeof (o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
            } else if (typeof (o) == "string")
                json += (name && ":") + "\"" + o.toString() + "\"";
            else
                json += (name && ":") + o.toString();
            return json;
        },
        innerXml: function (node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function (n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        } else
                            s += "/>";
                    } else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                    .replace(/[\"]/g, '\\"')
                    .replace(/[\n]/g, '\\n')
                    .replace(/[\r]/g, '\\r');
        },
        removeWhite: function (e) {
            e.normalize();
            for (var n = e.firstChild; n; ) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    } else
                        n = n.nextSibling;
                } else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                } else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}


////////////////////////////////////////////////////////////////////////////////////


///////////////JSON TO XML////////////////

function json2xml(o, tab) {
    var toXml = function (v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i = 0, n = v.length; i < n; i++)
                xml += ind + toXml(v[i], name, ind + "\t") + "\n";
        } else if (typeof (v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind + "\t");
                }
                xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
            }
        } else {          
            if(v!=='undefined'){
                xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
            }
        }
        return xml;
    }, xml = "";
    for (var m in o)
        xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}


/////////////////////////////////////////////////////////////////////////////////

function formatXml_old(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function (index, node) {
        var indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

////////////////////////////////////////////////////////////////////////////////

function formatXml(xml) {

    var reg = /(>)\s*(<)(\/*)/g;
    var wsexp = / *(.*) +\n/g;
    var contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    var pad = 0;
    var formatted = '';
    var lines = xml.split('\n');
    var indent = 0;
    var lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
    var transitions = {
        'single->single': 0,
        'single->closing': -1,
        'single->opening': 0,
        'single->other': 0,
        'closing->single': 0,
        'closing->closing': -1,
        'closing->opening': 0,
        'closing->other': 0,
        'opening->single': 1,
        'opening->closing': 0,
        'opening->opening': 1,
        'opening->other': 1,
        'other->single': 0,
        'other->closing': -1,
        'other->opening': 0,
        'other->other': 0
    };

    for (var i = 0; i < lines.length; i++) {
        var ln = lines[i];

        // handle optional <?xml ... ?> declaration
        if (ln.match(/\s*<\?xml/)) {
            formatted += ln + "\n";
            continue;
        }

        var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
        var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
        var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
        var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
        var fromTo = lastType + '->' + type;
        lastType = type;
        var padding = '';

        indent += transitions[fromTo];
        for (var j = 0; j < indent; j++) {
            padding += '\t';
        }
        if (fromTo == 'opening->closing')
            formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
        else
            formatted += padding + ln + '\n';
    }

    return formatted;
}
;


////////////////////////Save check script////////////////////////////////
var saved = true;
$(document).ready(function ()

{
    var db = " Official";
    if (dbSuffix === "2_1") {
        db = " Official(Old)";
    } else if (dbSuffix !== "") {
        db = " Dev(" + dbSuffix + ")";
    }
    $("#version").html(version + " --- Database:" + db);

    $("body").on("click", ".hot", function () {
        saved = false;
    });

    window.onbeforeunload = function () {
        if (!(saved)) {
            return "Did you save your changes?";
        }
    };



////////////////////////Save Spinner////////////////////////////////
    $('.spinner').on('click', function () {
        var $this = $(this);
        $this.removeClass('glyphicon glyphicon-floppy-disk');
        $this.button('loading');
        setTimeout(function () {
            $this.button('reset');
            $this.addClass('glyphicon glyphicon-floppy-disk');
        }, 1000);
    });

////////////////////////////////////////////////////////////////////////////////
});

///////////////////make draggable e.g. modal////////////////////////////////////
(function ($) {
    $.fn.drags = function (opt) {

        opt = $.extend({handle: "", cursor: "move"}, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
            if (opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                    drg_h = $drag.outerHeight(),
                    drg_w = $drag.outerWidth(),
                    pos_y = $drag.offset().top + drg_h - e.pageY,
                    pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                $('.draggable').offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function () {
            if (opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    };
})(jQuery);


////////////////////////////////////////////////////////////////////////////////

////////////////////////////////  Big Text Fields   /////////////////////////////

/* *************************************************************************** */

function textRender(instance, td, row, col, prop, value, cellProperties) {

    var title = value;
    var subtitle = '';
    if (title) {
        subtitle = title.substring(0, 8) + '...  ';
    } else {
        title = "";
    }
    
   

    var parent = ($(instance.rootElement).attr('id'));
    title = title.replace(/[@#'"\n]/gi, '`');
    td.innerHTML = "<div>" + subtitle + "<a onclick='textArea(" + row + "," + col + ",\"" + title + "\",\"" + parent + "\")'><button id='RowTxt_" + row + "' style='height:18px; width:36px; padding:0px; font-size:10px;' type='button' class=' nested_button btn btn-outline-secondary'><i class='fa fa-file-text' aria-hidden='true'></i></button></a></div>";// + value;          
    td.className = 'htCenter';
    
  
    return td;
}

$('#cancel_text').click(function () {
    $("#textArea_Modal").modal('hide');
});

function textArea(row, col, header, parent) {
    $('#remove_txt').remove();
    $('#note_area').val(header);
    $('#note_area').attr('row', row);
    $('#note_area').attr('col', col);
    $('#note_area').attr('parent', parent);
    $("#textArea_Modal").modal('show');
}
;

$('#save_text').click(function () {

    var valueTxt = $('#note_area').val();
    var parent = ($('#note_area').attr('parent'));
    var row = ($('#note_area').attr('row'));
    var col = ($('#note_area').attr('col'));

    set_Text_val(parseInt(row), parseInt(col), valueTxt, parent);
    $("#textArea_Modal").modal('hide');
});

/* *************************************************************************** */
///////////////////  Search Terms in Vocabulary modal   ////////////////////////

function filter_Voc_table(input_id, table_id) {
    // Declare variables 
    var input, filter, table, tr, td, i;
    input = document.getElementById(input_id);
    filter = input.value.toUpperCase();
    table = document.getElementById(table_id);
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                ///// Petrakis papatza to show nested info popover                
                if (input_id === 'not_used_search_input') {
                    tr[i].style.display = "none";
                }
                if (tr[i].innerHTML.toUpperCase().indexOf('TO_SHOW') > -1) {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
//////////////////////////////MAPS//////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function show_ship_route(cnt)
{
    // $('#map').empty();

    $('#geoRoute_Modal').on('shown.bs.modal', function () {
        $('#map').empty();
        loadMap(cnt);
    });

    $('#geoRoute_Modal').modal('show');
}
;


function get_coordinates(cnt) {

    var voyages_calendar = createJson(voyage_transactions[cnt], transaction_columns);
    var coordinates = new Array();

    $.each(voyages_calendar, function () {

        if ((this.calendar_langtitude) && (this.calendar_longtitude)) {

            var pp = this.calendar_langtitude.split(/[^\d\w\.]+/);
            var lat;

            if (pp.length === 3) {
                lat = ConvertDMSToDD(pp[0], pp[1], '00', pp[2]);
            } else if (pp.length === 4) {
                lat = ConvertDMSToDD(pp[0], pp[1], pp[2], pp[3]);
            }

            var qq = this.calendar_longtitude.split(/[^\d\w\.]+/);
            var lon;
            if (qq.length === 3) {
                lon = ConvertDMSToDD(qq[0], qq[1], '00', qq[2]);
            } else if (pp.length === 4) {
                lon = ConvertDMSToDD(qq[0], qq[1], qq[2], qq[3]);
            }

            if ((lat) && (lon)) {
                coordinates.push([lat, lon]);
            }

        }
    });

    $('#kml_file').attr('cnt', cnt);

    return coordinates;
}
///////////////////////Export KML//////////////////////////////////////////////

$('#kml_file').click(function () {

    var cnt = $(this).attr('cnt');
    var file;

    var voyages_calendar = createJson(voyage_transactions[cnt], transaction_columns);
    // var coordinates = new Array();

    var j = 0;
    var folder = new Object();

    $.each(voyages_calendar, function () {

        if ((this.calendar_langtitude) && (this.calendar_longtitude)) {

            var pp = this.calendar_langtitude.split(/[^\d\w\.]+/);
            var lat;

            if (pp.length === 3) {
                lat = ConvertDMSToDD(pp[0], pp[1], '00', pp[2]);
            } else if (pp.length === 4) {
                lat = ConvertDMSToDD(pp[0], pp[1], pp[2], pp[3]);
            }

            var qq = this.calendar_longtitude.split(/[^\d\w\.]+/);
            var lon;
            if (qq.length === 3) {
                lon = ConvertDMSToDD(qq[0], qq[1], '00', qq[2]);
            } else if (pp.length === 4) {
                lon = ConvertDMSToDD(qq[0], qq[1], qq[2], qq[3]);
            }

            if ((lat) && (lon)) {

                // coordinates.push([lat, lon]);

                var description = "";
                if (this.calendar_time) {
                    description = "Time: " + this.calendar_time + "\n";
                }
                if (this.calendar_weather) {
                    description = description + " Weather:" + this.calendar_weather + "\n";
                }
                if (this.calendar_wind_strength) {
                    description = description + " Wind strength:" + this.calendar_wind_strength + "\n";
                }
                if (this.calendar_wind_direction) {
                    description = description + " Wind direction: " + this.calendar_wind_direction + "\n";
                }
                if (this.calendar_direction) {
                    description = description + " Course of Ship: " + this.calendar_direction + "\n";
                }
                if (this.distance_value) {
                    description = description + " Distance: " + this.distance_value + "\n";
                }
                if (this.calendar_event_type) {
                    description = description + " Event type: " + this.calendar_event_type + "\n";
                }
                if (this.calendar_event_description) {
                    description = description + " Description: " + this.calendar_event_description + "\n";
                }


                //console.log(description);

                var point = new Object();
                var coord = new Object();

                coord['coordinates'] = lon + ',' + lat;

                point['styleUrl'] = "#icon-1899-DB4436";
                point['Point'] = coord;
                if (this.calendar_date) {
                    point['name'] = "Date: " + this.calendar_date;
                }

                point['description'] = description;

                folder['Placemark_' + j] = point;
                j++;
            }
        }
    });

    folder['name'] = 'route';

    var document = new Object();
    document['Style'] = "___";
    document['Folder'] = folder;


    var root = new Object();
    root['Document'] = document;

    var kml = new Object();
    kml['kml_1'] = root;


    var xml = formatXml(json2xml(kml));

    xml = xml.replace(/<Placemark_(\d+)>/g, '<Placemark>');
    xml = xml.replace(/<\/Placemark_(\d+)>/g, "</Placemark>");
    xml = xml.replace(/<kml_(\d+)>/g, '<kml xmlns="http://www.opengis.net/kml/2.2">');
    xml = xml.replace(/<\/kml_(\d+)>/g, "</kml>");
    xml = xml.replace(/<xml_(\d+)>/g, '<?xml version="1.0" encoding="UTF-8"?>');
    xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;


    var style = "<Style id='icon-1899-DB4436-normal'>" +
            "<IconStyle>" +
            "<color>ff3644db</color>" +
            "<scale>1</scale>" +
            "<Icon>" +
            "<href>http://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>" +
            "</Icon>" +
            "<hotSpot x='32' xunits='pixels' y='64' yunits='insetPixels'/>" +
            "</IconStyle>" +
            "<LabelStyle>" +
            "<scale>0</scale>" +
            "</LabelStyle>" +
            "</Style>" +
            "<Style id='icon-1899-DB4436-highlight'>" +
            "<IconStyle>" +
            "<color>ff3644db</color>" +
            "<scale>1</scale>" +
            "<Icon>" +
            "<href>http://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>" +
            "</Icon>" +
            "<hotSpot x='32' xunits='pixels' y='64' yunits='insetPixels'/>" +
            "</IconStyle>" +
            "<LabelStyle>" +
            "<scale>1</scale>" +
            "</LabelStyle>" +
            "</Style>" +
            "<StyleMap id='icon-1899-DB4436'>" +
            "<Pair>" +
            " <key>normal</key>" +
            "<styleUrl>#icon-1899-DB4436-normal</styleUrl>" +
            "</Pair>" +
            "<Pair>" +
            "<key>highlight</key>" +
            "<styleUrl>#icon-1899-DB4436-highlight</styleUrl>" +
            "</Pair>" +
            "</StyleMap>" +
            "<Style id='icon-1899-DB4436-nodesc-normal'>" +
            "<IconStyle>" +
            "<color>ff3644db</color>" +
            "<scale>1</scale>" +
            "<Icon>" +
            "<href>http://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>" +
            "</Icon>" +
            "<hotSpot x='32' xunits='pixels' y='64' yunits='insetPixels'/>" +
            "</IconStyle>" +
            "<LabelStyle>" +
            "<scale>0</scale>" +
            "</LabelStyle>" +
            "<BalloonStyle>" +
            "<text><![CDATA[<h3>$[name]</h3>]]></text>" +
            "</BalloonStyle>" +
            "</Style>";
    /*"<Style id='icon-1899-DB4436-nodesc-highlight'>"+
     "<IconStyle>"+
     "<color>ff3644db</color>"+
     "<scale>1</scale>"+
     "<Icon>"+
     "<href>http://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>"+
     "</Icon>"+
     "<hotSpot x='32' xunits='pixels' y='64' yunits='insetPixels'/>"+
     " </IconStyle>"+
     "<LabelStyle>"+
     "<scale>1</scale>"+
     "</LabelStyle>"+
     "<BalloonStyle>"+
     "<text><![CDATA[<h3>$[name]</h3>]]></text>"+
     "</BalloonStyle>"+
     "</Style>"+
     "<StyleMap id='icon-1899-DB4436-nodesc'>"+
     "<Pair>"+
     "<key>normal</key>"+
     "<styleUrl>#icon-1899-DB4436-nodesc-normal</styleUrl>"+
     "</Pair>"+
     "<Pair>"+
     "<key>highlight</key>"+
     "<styleUrl>#icon-1899-DB4436-nodesc-highlight</styleUrl>"+
     "</Pair>"+
     "</StyleMap>";*/

    xml = xml.replace("<Style>___</Style>", style);

    var filename = $('#unique_filename').text();
    filename.replace(/[`()&_|+\-=?;:!'",.<>\{\}\[\]\\\/]/gi, '_');
    var route = parseInt(cnt) + 1;
    filename = filename + "_route_" + route;


    file = new File([xml.toString()], filename + '.kml', {type: "text/json;charset=utf-8"});

    console.log(cnt);
    saveAs(file);

});
///////////////////////////////////////////////////////////////////////////////
function create_klm_file(cnt) {

    var voyages_calendar = createJson(voyage_transactions[cnt], transaction_columns);

    var j = 0;
    var folder = new Object();

    $.each(voyages_calendar, function () {

        if ((this.calendar_langtitude) && (this.calendar_longtitude)) {

            var pp = this.calendar_langtitude.split(/[^\d\w\.]+/);
            var lat;

            if (pp.length === 3) {
                lat = ConvertDMSToDD(pp[0], pp[1], '00', pp[2]);
            } else if (pp.length === 4) {
                lat = ConvertDMSToDD(pp[0], pp[1], pp[2], pp[3]);
            }

            var qq = this.calendar_longtitude.split(/[^\d\w\.]+/);
            var lon;
            if (qq.length === 3) {
                lon = ConvertDMSToDD(qq[0], qq[1], '00', qq[2]);
            } else if (pp.length === 4) {
                lon = ConvertDMSToDD(qq[0], qq[1], qq[2], qq[3]);
            }

            if ((lat) && (lon)) {

                var description = "";
                if (this.calendar_time) {
                    description = "Time: " + this.calendar_time + "\n";
                }
                if (this.calendar_weather) {
                    description = description + " Weather:" + this.calendar_weather + "\n";
                }
                if (this.calendar_wind_strength) {
                    description = description + " Wind strength:" + this.calendar_wind_strength + "\n";
                }
                if (this.calendar_wind_direction) {
                    description = description + " Wind direction: " + this.calendar_wind_direction + "\n";
                }
                if (this.calendar_direction) {
                    description = description + " Course of Ship: " + this.calendar_direction + "\n";
                }
                if (this.distance_value) {
                    description = description + " Distance: " + this.distance_value + "\n";
                }
                if (this.calendar_event_type) {
                    description = description + " Event type: " + this.calendar_event_type + "\n";
                }
                if (this.calendar_event_description) {
                    description = description + " Description: " + this.calendar_event_description + "\n";
                }

                var point = new Object();
                var coord = new Object();

                coord['coordinates'] = lon + ',' + lat;

                point['styleUrl'] = "#icon-1899-DB4436";
                point['Point'] = coord;
                if (this.calendar_date) {
                    point['name'] = "Date: " + this.calendar_date;
                }

                point['description'] = description;

                folder['Placemark_' + j] = point;
                j++;
            }
        }
    });

    folder['name'] = 'route';

    var document = new Object();
    document['Style'] = "___";
    document['Folder'] = folder;


    var root = new Object();
    root['Document'] = document;

    var kml = new Object();
    kml['kml_1'] = root;

    var xml = formatXml(json2xml(kml));

    xml = xml.replace(/<Placemark_(\d+)>/g, '<Placemark>');
    xml = xml.replace(/<\/Placemark_(\d+)>/g, "</Placemark>");
    xml = xml.replace(/<kml_(\d+)>/g, '<kml xmlns="http://www.opengis.net/kml/2.2">');
    xml = xml.replace(/<\/kml_(\d+)>/g, "</kml>");
    xml = xml.replace(/<xml_(\d+)>/g, '<?xml version="1.0" encoding="UTF-8"?>');
    xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;

    var style = "<Style id='icon-1899-DB4436-normal'>" +
            "<IconStyle>" +
            "<color>ff3644db</color>" +
            "<scale>1</scale>" +
            "<Icon>" +
            "<href>https://cdn.iconscout.com/icon/premium/png-256-thumb/steamship-566304.png</href>" +
            "</Icon>" +
            "</IconStyle>" +
            "<LabelStyle>" +
            "<scale>0</scale>" +
            "</LabelStyle>" +
            "</Style>" +
            "<StyleMap id='icon-1899-DB4436'>" +
            "<Pair> " +
            "<key>normal</key>" +
            "<styleUrl>#icon-1899-DB4436-normal</styleUrl>" +
            "</Pair>" +
            "<Pair>" +
            "<key>highlight</key>" +
            "<styleUrl>#icon-1899-DB4436-highlight</styleUrl>" +
            "</Pair>" +
            "</StyleMap>";

    xml = xml.replace("<Style>___</Style>", style);
    console.log(cnt);

    return xml;
}
;

////////////////////////////////////////////////////////////////////////////////
$('#open_kml').click(function () {

    var cnt = $("#kml_file").attr('cnt');
    var kml = create_klm_file(cnt);
    var route_name = voyage_calendar.getDataAtCell(cnt, 2) + " - " + voyage_calendar.getDataAtCell(cnt, 3);
    localStorage.setItem("kml_file", JSON.stringify(kml));
    // console.log(kml)    
    //  window.open('kml.html?cnt='+cnt+'&name='+route_name,'_blank'); 

});


////////////////////////////////////////////////////////////////////////////////

function loadMap(cnt) {

  
    var source = new ol.source.Vector({wrapX: false});

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    var vectorSource = new ol.source.Vector()
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });



    var geomap = new ol.layer.Tile({
        source: new ol.source.TileJSON({
            url: 'http://api.tiles.mapbox.com/v3/' +
                    'mapbox.natural-earth-hypso-bathy.jsonp',
            crossOrigin: 'anonymous'
        })
    });


    var map = new ol.Map({
        layers: [geomap, vector, vectorLayer],
        target: 'map',
        view: new ol.View({
            center: [-3443946.7464169003, 3796168.572754994],
            zoom: 2,
            minZoom: 1.5,
            maxZoom: 20
        })
    });

    var markers = [];
    var formatted_coords = get_coordinates(cnt);

    function AddMarkers() {
        //create a bunch of icons and add to source vector
        for (var i = 0; i < formatted_coords.length; i++) {
            var x = formatted_coords[i][1];
            var y = formatted_coords[i][0];

            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857')),
                name: 'Marker ' + i
            });
            markers[i] = ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857');
            vectorSource.addFeature(iconFeature);
        }

        //create the style
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                // anchor: [0.5, 0.5],
                // anchorXUnits: 'fraction',
                //  anchorYUnits: 'pixels',
                opacity: 0.80,
                src: '../img/pin1.png'
            }))
        });

        //add the feature vector to the layer vector, and apply a style to whole layer
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: iconStyle
        });
        return vectorLayer;
    }


    var layerMarkers = AddMarkers();

    var layerLines = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                    geometry: new ol.geom.LineString(markers, 'XY'),
                    name: 'Line'
                })]
        })
    });

    map.addLayer(layerMarkers);
    //map.addLayer(layerLines);

}
;

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

////////////////////////COLLECT INSTANCES///////////////////////////////


///////////////////////////////////////////////////////////////////////////////

function ships2Json(recordId, local_storage_label, xml_label) {

    var persons = JSON.parse(localStorage.getItem(local_storage_label));
    var json_persons = new Object();
    var cnt = 0;
    var person_labels = new Object();

    person_labels['name'] = '';
    person_labels['type'] = '';
    person_labels['construction_date'] = '';
    person_labels['construction_location'] = '';
    person_labels['telegraphic_code'] = '';
    person_labels['registration_number'] = '';
    person_labels['flag'] = '';
    person_labels['owner_company'] = '';
    person_labels['record_id'] = recordId;


    if ((persons) && (persons[recordId])) {
        $.each(persons[recordId], function (table_id) {

            $.each(this, function (row) {
                var thiz = Object.assign({}, person_labels, this);
                var tmp = new Object();
                tmp['table_id'] = table_id;
                tmp['row'] = row.replace('row_', '');
                var fnl = Object.assign({}, thiz, tmp);
                json_persons[xml_label + cnt] = Object.assign({}, json_persons[xml_label + cnt], fnl);
                cnt++;
            });
        });
    }

    //console.log(json_persons);

    return json_persons;
}

////////////////////////////////////////////////////////////////////////////////
function locs2Json(recordId, local_storage_label, xml_label) {

    var locations = JSON.parse(localStorage.getItem(local_storage_label));
    var json_locations = new Object();
    var cnt = 0;
    var location_labels = new Object();

    location_labels['record_id'] = recordId;

    if ((locations) && (locations[recordId])) {
        $.each(locations[recordId], function (table_id) {
            $.each(this, function (row) {
                var thiz = Object.assign({}, location_labels, this);
                var tmp = new Object();
                tmp['table_id'] = table_id;
                tmp['row'] = row.replace('row_', '');
                var fnl = Object.assign({}, thiz, tmp);
                json_locations[xml_label + cnt] = Object.assign({}, json_locations[xml_label + cnt], fnl);
                cnt++;
            });
        });
    }

    //console.log(json_persons);

    return json_locations;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function orgs2Json(recordId, local_storage_label, xml_label) {

    var locations = JSON.parse(localStorage.getItem(local_storage_label));
    var json_locations = new Object();
    var cnt = 0;
    var location_labels = new Object();

    location_labels['record_id'] = recordId;

    if ((locations) && (locations[recordId])) {
        $.each(locations[recordId], function (table_id) {
            $.each(this, function (row) {
                var thiz = Object.assign({}, location_labels, this);
                var tmp = new Object();
                tmp['table_id'] = table_id;
                tmp['row'] = row.replace('row_', '');
                var fnl = Object.assign({}, thiz, tmp);
                json_locations[xml_label + cnt] = Object.assign({}, json_locations[xml_label + cnt], fnl);
                cnt++;
            });
        });
    }

    //console.log(json_persons);

    return json_locations;
}

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

function handle_multiple_table_instances(row, col, value, tbl_lbl, cols, cols_lbls, tbl1, tbl2, label) {

    var vals = "";
    if (value) {
        vals = value.split(/\n/);
    }
    if ($(vals).size() > 1) {
        $.each(vals, function (i) {
            if (label === 'PERSONS') {
                handle_persons(row + i, col, this, tbl_lbl, cols, cols_lbls, tbl1, tbl2, label);
            } else if (label === 'LOCS') {
                handle_locations(this, tbl_lbl, row, col, label, tbl1);
            } else if (label === 'ORGS') {
                handle_organizations(this, tbl_lbl, row + i, col, label);

            }
        });
    } else {
        if (label === 'PERSONS') {
            handle_persons(row, col, value, tbl_lbl, cols, cols_lbls, tbl1, tbl2, label);
        } else if (label === 'LOCS') {
            handle_locations(value, tbl_lbl, row, col, label, tbl1);
        } else if (label === 'ORGS') {
            handle_organizations(value, tbl_lbl, row, col, label);
        }
    }
}
;

////////////////////////////////////////////////////////////////////////////////

//function katsigaros(row,
function create_related_persons(row,
        value,
        tbl1,
        tbl2,
        relation,
        name,
        surname_a,
        original_surname,
        surname_b,
        origin_location,
        original_surname_b) {

    var vals;

    if (value) {
        vals = value.split(/\n/);
    } else {
        vals = "";
    }

    var relations = relation.split(/\n/);
    var surnames_a = '';
    if (surname_a && surname_a.indexOf("\n") > 0) {
        surnames_a = surname_a.split(/\n/);
    }
    var surnames_b = '';
    if (surname_b && surname_b.indexOf("\n") > 0) {
        surnames_b = surname_b.split(/\n/);
    } else if (surname_b) {
        surnames_b = surname_b;
    }

    var locations_origin = "";
    if (origin_location && origin_location.indexOf("\n") > 0) {
        locations_origin = origin_location.split(/\n/);
    } else if (origin_location) {
        locations_origin = origin_location;
    }



    if ($(vals).size() > 1) {

        $.each(relations, function (i) {
            /* var pro;            
             if (locations_origin[i] && locations_origin[i].length === 1) {
             pro = origin_location;                
             } else {
             pro = locations_origin[i];               
             }
             */

            if (this.toLowerCase() === 'pare') {
                if (vals[i] && (original_surname) && ((surnames_a[i] === '^^') || (surnames_a[i] === '&'))) {
                    if (vals[i]) {
                        handle_persons(row + i, 22, vals[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (original_surname) {
                        handle_persons(row + i, 23, original_surname, 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (surnames_b[i]) {
                        handle_persons(row + i, 24, surnames_b[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (locations_origin[i]) {
                        handle_persons(row + i, 25, locations_origin[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }

                } else if (vals[i] && (surnames_a[i])) {

                    if (vals[i]) {
                        handle_persons(row + i, 22, vals[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    handle_persons(row + i, 23, surnames_a[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    if (surnames_b[i]) {
                        handle_persons(row + i, 24, surnames_b[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (locations_origin[i]) {
                        handle_persons(row + i, 25, locations_origin[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                }
            } else if (this.toLowerCase() === 'mare') {
                if (vals[i] && (original_surname_b) && ((surnames_a[i] === '^^') || (surnames_a[i] === '&'))) {
                    if (vals[i]) {
                        handle_persons(row + i, 22, vals[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    handle_persons(row + i, 23, original_surname_b, 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    if (surnames_b[i]) {
                        handle_persons(row + i, 24, surnames_b[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }

                    if (locations_origin[i] && locations_origin[i].length > 2) {
                        handle_persons(row + i, 25, locations_origin[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                } else if (vals[i] && (surnames_a[i])) {
                    if (vals[i]) {
                        handle_persons(row + i, 22, vals[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    handle_persons(row + i, 23, surnames_a[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');

                    if (surnames_b[i]) {
                        handle_persons(row + i, 24, surnames_b[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (locations_origin[i] && locations_origin[i].length > 2) {
                        handle_persons(row + i, 25, locations_origin[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                }
            } else {
                if (vals[i] && (surname_a[i])) {
                    if (vals[i]) {
                        handle_persons(row + i, 22, vals[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (surname_a[i] && surname_a[i] !== '') {
                        handle_persons(row + i, 23, surnames_a[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (surnames_b[i]) {
                        handle_persons(row + i, 24, surnames_b[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                    if (locations_origin[i] && locations_origin[i].length > 2) {
                        handle_persons(row + i, 25, locations_origin[i], 'death_register', [22, 23, 24, 25], ['name', 'surname_a', 'surname_b', 'place_of_birth'], tbl1, tbl2, 'PERSONS');
                    }
                }
            }

        });
    }
}
;


////////////////////////////////////////////////////////////////////////////////
function clear_LocalStorage_instances() {
    localStorage.removeItem('PERSONS');
    localStorage.removeItem('LOCS');
    localStorage.removeItem('SHIPS');
    localStorage.removeItem('ORGS');
}
;

////////////////////////////////////////////////////////////////////////////////
function create_Id_from_instanceJSON(person, template, record_Id, instances_fromJSON, voc_type) {

    var term_Id = "";
    template = template.replace('/FastCatTeam/templates/', '');

    if (voc_type) {

        if (vocabularies_fromJSON[template]) {
            var json_vocs = vocabularies_fromJSON[template];
            var voc_list = json_vocs[0];

            if (voc_list[voc_type]) {
                term_Id = voc_list[voc_type] + '/' + person.value;
            } else {
                term_Id = person.value;
            }
        } else {
            term_Id = person.value;
        }

    } else {

        if (instances_fromJSON[template]) {

            var JSON_instances = instances_fromJSON[template][0];
            var key = person.usage[record_Id].occurences[0].table.replace(/\d/g, "");

            if (key.substr(key.length - 1) === '_') {
                key = key.replace(/.$/, "");
            }

            if (JSON_instances.hasOwnProperty(key)) {
                $.each(JSON_instances[key], function () {

                    $.each(this, function () {
                        if (person[this.toString()]) {
                            term_Id = term_Id + '/' + person[this.toString()];
                        } else {
                            term_Id = term_Id + '/' + 'EMPTY';
                        }
                    });
                });
            }
        }

    }

    if (term_Id[0] === '/') {
        term_Id = term_Id.substr(1);
    }

    return term_Id;
}
;


////////////////////EXPORT INSTANCES TO XML/////////////////////////////

/**
 * Create instance usages
 * 
 * @param {type} person_usage
 * @param {type} person
 * @param {type} recordId
 * @param {type} instance_type
 * @param {type} voc_type
 * @returns {create_usages.usages|Object}
 */

function create_usages(person_usage, person, recordId, instance_type,voc_type) {

    var usages = new Object();

    usages['template'] = person_usage.template;
    usages['title'] = person_usage.title;
    usages['record_id'] = recordId;//this.usage[recordId].title;
    
    var url_string = window.location.href;
    var url = new URL(url_string);  
    var pathname = (url.pathname).split('/');
    var webapp = pathname[1];
    
    var team_url = url.origin + "/"+ webapp;     
    var template_url = template_types[person_usage.template]+".html";
 
    var url_string = team_url+'/templates/'+template_url+'?name='+recordId+'&templateTitle='+person_usage.template+'&mode=teamView';          
        url_string = url_string.replace(/ /g,'%20');
  
    usages['url'] = "<![CDATA["+url_string+"]]>";
    
    if(instance_type==='persons'){
        usages['personId'] = create_Id_from_instanceJSON(person, person_usage.template, recordId,persons_instances_fromJSON);
    }else if (instance_type==='organizations'){        
        usages['organizationId'] = person.name;
    }else if (instance_type==='locations'){                
        usages['locationId'] = person.location_name;
    }else if (instance_type==='ships'){                      
        usages['shipId'] = create_Id_from_instanceJSON(person, person_usage.template, recordId, ships_instances_fromJSON);
    }else if (instance_type==='vocabularies'){               
        usages['vocabularyId'] = create_Id_from_instanceJSON(person, person_usage.template, recordId, vocabularies_fromJSON,voc_type);
    }

    var occs = new Object();

    $.each(person_usage.occurences, function (cnt) {
        var occ = new Object();
        occ['row'] = this.row;
        occ['table'] = this.table;
        occ['tableVariable'] = this.tableVariable;
        occs['occurence_' + cnt] = occ;
    });
    usages['occurencies'] = occs;

    return(usages);

}
////////////////////////////////////////////////////////////////////////////////

function find_other_usages(instances_res, instances_doc, instance_type) {
    
    $.each(instances_res, function () {        
        $.each(this, function () {

            var instance = this;
            var replaced_By = this.replacedBy;
            var changed = instances_doc.instances[JSON.stringify(replaced_By).replace(/"/g, "'")];

            $.each(replaced_By, function (key) {
                if (instance[key] !== this.toString()) {
                    instance[key] = changed[key];
                }
            });

            var usages_result = new Object();
            if (changed) {
                if (changed['sameAs']) {
                    var cnt = 0;
                    $.each(changed.sameAs, function () {

                        var key = this.toString();

                        $.each(instances_doc.instances[key].usage, function (recordId) {
                            cnt++;
                            usages_result['usage_' + cnt] = create_usages(this, instances_doc.instances[key], recordId, instance_type);
                        });
                        instance['usages'] = usages_result;
                        
                    });
                }
            }
            delete instance['replacedBy'];
            delete instance['sameAs'];
        });
    });

}
;
/////////////////////////////////////////////////////////////////////////////////

function vocabularies_XML(doc, beautify) {

    var terms = new Object();
    var vocs = new Object();
    ;
    var vocs_xml;



    var i = 0;

    $.each(doc.rows, function () {
        var voc_type = this.id;
        var tmp_terms = new Object();
        var term_pseudo_cnt = 0;
        $.each(this.doc.terms, function () {



            if (this.usage[recordId]) {

                var term = new Object();

                term['value'] = this.value;

                if (this.preferred) {
                    term['preferred'] = this.preferred;
                } else {
                    term['preferred'] = "";
                }
                if (this.broader) {
                    term['broader'] = this.broader;
                } else {
                    term['broader'] = "";
                }

                term['collection'] = voc_type;

                var usages = new Object();
                var row = this;
                var cnt = 0;

                $.each(this.usage, function (recordId) {
                    cnt++;
                    usages['usage_' + cnt] = create_usages(this, row, recordId, 'vocabularies', voc_type);
                });

                term['usages'] = usages;
                term_pseudo_cnt++;

                terms['term_' + i] = term;
                i++;

            }

        });
    });

    vocs['terms'] = terms;

    if (beautify === 'beautify') {
        vocs_xml = formatXml(json2xml(vocs));
    } else {
        vocs_xml = json2xml(vocs);
    }

    vocs_xml = vocs_xml.replace(/<occurence_(\d+)>/g, '<occurence index="$1">');
    vocs_xml = vocs_xml.replace(/<\/occurence_(\d+)>/g, "</occurence>");

    vocs_xml = vocs_xml.replace(/<usage_(\d+)>/g, '<usage index="$1">');
    vocs_xml = vocs_xml.replace(/<\/usage_(\d+)>/g, "</usage>");

    vocs_xml = vocs_xml.replace(/<term_(\d+)>/g, '<term index="$1">');
    vocs_xml = vocs_xml.replace(/<\/term_(\d+)>/g, "</term>");
    
    console.log(vocs);

    return vocs_xml;

}
;


////////////////////////////////////////////////////////////////////////////////

/**
 * persons instanxes XML
 * @param {type} persons_doc
 * @param {type} beautify
 * @returns {String|formatXml.formatted|person_instances_XML.persons_xml}
 */

function person_instances_XML(persons_doc, beautify) {

//var url_string = ;
    var url = new URL(window.location.href);
    var pp = unescape(url.pathname).replace('/FastCat/templates/', '');    

    var i = 0;
    var person = new Object();

    var persons_xml;
    var persons = new Object();
    
    $.each(persons_doc.instances, function () {
        person = new Object();

        if (this.usage && (jQuery.isEmptyObject(this.usage)) === false && ((this.usage).hasOwnProperty(recordId))) {
            if(this.value){
                person['value'] = (this.value).toLowerCase();
            }else {
                person['value'] = '';
            }          
            if (this.name) {
                person['name'] = this.name;
            } else {
                person['name'] = '';
            }
            if (this.surname_a) {
                person['surname_a'] = this.surname_a;
            } else {
                person['surname_a'] = '';
            }
            if (this.surname_b) {
                person['surname_b'] = this.surname_b;
            } else {
                person['surname_b'] = '';
            }
            if (this.fathers_name) {
                person['fathers_name'] = this.fathers_name;
            } else {
                person['fathers_name'] = '';
            }
            if (this.maiden_name) {
                person['maiden_name'] = this.maiden_name;
            } else {
                person['maiden_name'] = '';
            }

            if (this.date_of_birth) {
                person['date_of_birth'] = this.date_of_birth;
            } else {
                person['date_of_birth'] = '';
            }
            if (this.place_of_birth) {
                person['place_of_birth'] = this.place_of_birth;
            } else {
                person['place_of_birth'] = '';
            }
            if (this.date_of_death) {
                person['date_of_death'] = this.date_of_death;
            } else {
                person['date_of_death'] = '';
            }
            if (this.registration_number) {
                person['registration_number'] = this.registration_number;
            } else {
                person['registration_number'] = '';
            }
            if (this.status) {
                person['status'] = this.status;
            } else {
                person['status'] = '';
            }

////////////////////////////////////////////////////////////////////////////////
            // SAME AS REPLACED BY
            var same = new Object();
            if (this.sameAs) {
                var same_as = this.sameAs;
                var sames = new Object();
                $.each(this.sameAs, function (cnt) {
                    sames['same_' + cnt] = JSON.parse(same_as[cnt].replace(/'/g, '"'));
                    same['sames'] = sames;
                });
            }
            person['sameAs'] = same;

            if (this.replacedBy) {
                person['replacedBy'] = JSON.parse((this.replacedBy).replace(/'/g, '"'));
            } else {
                person['replacedBy'] = new Object();
            }
                                                         
            var usagios = new Object();
            var row = this;
            var oo = 0;
     
            $.each(this.usage, function (recordId) {                
         
                usagios['usage_' + oo] = create_usages(this, row, recordId,'persons');  
                oo++;
            });                      

            person['usages'] = usagios;
            persons['person_' + i] = person;
            i++;
        }

    });

    var persons_res = new Object();
    persons_res['persons'] = persons;    
    find_other_usages(persons_res,persons_doc,'persons');

/////////////////////////////////////////////////////////////////////////////////
    if (beautify === 'beautify') {
        persons_xml = formatXml(json2xml(persons_res));
    } else {
        persons_xml = json2xml(persons_res);
    }

   // console.log(persons_res);

    persons_xml = persons_xml.replace(/<person_(\d+)>/g, '<person index="$1">');
    persons_xml = persons_xml.replace(/<\/person_(\d+)>/g, "</person>");

    persons_xml = persons_xml.replace(/<occurence_(\d+)>/g, '<occurence index="$1">');
    persons_xml = persons_xml.replace(/<\/occurence_(\d+)>/g, "</occurence>");

    persons_xml = persons_xml.replace(/<usage_(\d+)>/g, '<usage index="$1">');
    persons_xml = persons_xml.replace(/<\/usage_(\d+)>/g, "</usage>");

    return persons_xml;

}
;

/**
 * Ship instances XML
 * @param {type} ships_doc
 * @param {type} beautify
 * @returns {String|formatXml.formatted|ship_instances_XML.ships_xml}
 */

function ship_instances_XML(ships_doc, beautify) {

    var i = 0;
    var ship = new Object();

    var ships_xml;
    var ships = new Object();
  
    $.each(ships_doc.instances, function () {

        ship = new Object();
        if (this.usage && (jQuery.isEmptyObject(this.usage)) === false && ((this.usage).hasOwnProperty(recordId))) {

            if(this.value){
                ship['value'] = (this.value).toLowerCase();
            }else {
                ship['value'] = '';
            }  
            
            if (this.name) {
                ship['name'] = this.name;
            } else {
                ship['name'] = '';
            }
                        
            if (this.previous_name) {
                var oo;
                if (this.previous_name.indexOf("\n") > 0) {
                    oo = this.previous_name.split(/\n/);
                    $.each(oo, function (cnt) {
                        ship['previous_name_' + cnt] = (this.toString());
                    });
                } else {
                    ship['previous_name'] = (this.previous_name).toString();
                }
            } else {
                ship['previous_name'] = '';
            }
            if (this.type) {
                ship['type'] = this.type;
            } else {
                ship['type'] = '';
            }
            if (this.call_signal) {
                ship['call_signal'] = this.call_signal;
            } else {
                ship['call_signal'] = '';
            }
            if (this.construction_location) {
                ship['construction_location'] = this.construction_location;
            } else {
                ship['construction_location'] = '';
            }
            if (this.construction_date) {
                ship['construction_date'] = this.construction_date;
            } else {
                ship['construction_date'] = '';
            }
            if (this.telegraphic_code) {
                ship['telegraphic_code'] = this.telegraphic_code;
            } else {
                ship['telegraphic_code'] = '';
            }
            if (this.registration_number) {
                ship['registration_number'] = this.registration_number;
            } else {
                ship['registration_number'] = '';
            }

            if (this.registration_location) {
                ship['registration_location'] = this.registration_location;
            } else {
                ship['registration_location'] = '';
            }

            if (this.registration_number) {
                ship['registration_number'] = this.registration_number;
            } else {
                ship['registration_number'] = '';
            }
            if (this.registration_list) {
                ship['registration_list'] = this.registration_list;
            } else {
                ship['registration_list'] = '';
            }
            if (this.flag) {
                ship['flag'] = this.flag;
            } else {
                ship['flag'] = '';
            }
            if (this.owner_company) {
                ship['owner_company'] = this.owner_company;
            } else {
                ship['owner_company'] = '';
            }
                                    
////////////////////////////////////////////////////////////////////////////////
            // SAME AS REPLACED BY
            var same = new Object();
            if (this.sameAs) {
                var same_as = this.sameAs;
                var sames = new Object();
                $.each(this.sameAs, function (cnt) {
                    sames['same_' + cnt] = JSON.parse(same_as[cnt].replace(/'/g, '"'));
                    same['sames'] = sames;
                });
            }
            ship['sameAs'] = same;

            if (this.replacedBy) {
                ship['replacedBy'] = JSON.parse((this.replacedBy).replace(/'/g, '"'));
            } else {
                ship['replacedBy'] = new Object();
            }            
////////////////////////////////////////////////////////////////////////////////

            var usagios = new Object();
            var row = this;
            var oo = 0;
            
            $.each(this.usage, function (recordId) {           
             
                usagios['usage_' + oo] = create_usages(this, row, recordId,'ships');
                oo++;
                
            });

            ship['usages'] = usagios;
            ships['ship_' + i] = ship;
            i++;            
        }                
    });
    
   var ships_res = new Object();
   ships_res['ships'] = ships; 
   find_other_usages(ships_res,ships_doc,'ships');
   

   
/////////////////////////////////////////////////////////////////////////////////

    if (beautify === 'beautify') {        
        ships_xml = formatXml(json2xml(ships_res));
    } else {
        ships_xml = json2xml(ships_res);
    }

    ships_xml = ships_xml.replace(/<previous_name_(\d+)>/g, '<previous_name index="$1">');
    ships_xml = ships_xml.replace(/<\/previous_name_(\d+)>/g, "</previous_name>");

    ships_xml = ships_xml.replace(/<ship_(\d+)>/g, '<ship index="$1">');
    ships_xml = ships_xml.replace(/<\/ship_(\d+)>/g, "</ship>");

    ships_xml = ships_xml.replace(/<occurence_(\d+)>/g, '<occurence index="$1">');
    ships_xml = ships_xml.replace(/<\/occurence_(\d+)>/g, "</occurence>");
    
    ships_xml = ships_xml.replace(/<usage_(\d+)>/g, '<usage index="$1">');
    ships_xml = ships_xml.replace(/<\/usage_(\d+)>/g, "</usage>");

    return ships_xml;

}
;

////////////////////////////////////////////////////////////////////////////////
/**
 * Organization instances XML
 * @param {type} organizations_doc
 * @param {type} beautify
 * @returns {String|organization_instances_XML.organizations_xml|formatXml.formatted}
 */
function organization_instances_XML(organizations_doc, beautify) {

    var i = 0;
    var organization = new Object();

    var organizations_xml;
    var organizations = new Object();
    //organizations['record_id'] = recordId;

    $.each(organizations_doc.instances, function () {

        organization = new Object();
        if (this.usage && (jQuery.isEmptyObject(this.usage)) === false && ((this.usage).hasOwnProperty(recordId))) {

            if(this.value){
                organization['value'] = (this.value).toLowerCase();
            }else {
                organization['value'] = '';
            }  
            if (this.name) {
                organization['name'] = this.name;
            } else {
                organization['name'] = '';
            }

////////////////////////////////////////////////////////////////////////////////
            // SAME AS REPLACED BY
            var same = new Object();
            if (this.sameAs) {
                var same_as = this.sameAs;
                var sames = new Object();
                $.each(this.sameAs, function (cnt) {
                    sames['same_' + cnt] = JSON.parse(same_as[cnt].replace(/'/g, '"'));
                    same['sames'] = sames;
                });
            }

            organization['sameAs'] = same;

            if (this.replacedBy) {
                organization['replacedBy'] = JSON.parse((this.replacedBy).replace(/'/g, '"'));
            } else {
                organization['replacedBy'] = new Object();
            }

//////////////////////////////////////////////////////////////////////////////                        

            var usagios = new Object();
            var row = this;
            var oo = 0;

            $.each(this.usage, function (recordId) {
                var usages = new Object();
                
                usagios['usage_' + oo] = create_usages(this, row, recordId, 'organizations');
                oo++;

            });

            organization['usages'] = usagios;
            organizations['organization_' + i] = organization;
            i++;
        }
    });

    var organizations_res = new Object();
    organizations_res['organizations'] = organizations;
    find_other_usages(organizations_res,organizations_doc,'organizations');


/////////////////////////////////////////////////////////////////////////////////
    if (beautify === 'beautify') {
        organizations_xml = formatXml(json2xml(organizations_res));
    } else {
        organizations_xml = json2xml(organizations_res);
    }

    organizations_xml = organizations_xml.replace(/<organization_(\d+)>/g, '<organization index="$1">');
    organizations_xml = organizations_xml.replace(/<\/organization_(\d+)>/g, "</organization>");

    organizations_xml = organizations_xml.replace(/<occurence_(\d+)>/g, '<occurence index="$1">');
    organizations_xml = organizations_xml.replace(/<\/occurence_(\d+)>/g, "</occurence>");
    
    organizations_xml = organizations_xml.replace(/<usage_(\d+)>/g, '<usage index="$1">');
    organizations_xml = organizations_xml.replace(/<\/usage_(\d+)>/g, "</usage>");

    return organizations_xml;

}
;

////////////////////////////////////////////////////////////////////////////////

function location_instances_XML(locations_doc, beautify) {

    var i = 0;
    var location = new Object();

    var locations_xml;
    var locations = new Object();


    $.each(locations_doc.instances, function () {

        location = new Object();
                
        if (this.usage && (jQuery.isEmptyObject(this.usage)) === false && ((this.usage).hasOwnProperty(recordId))) {

            if(this.value){
                location['value'] = (this.value).toLowerCase();
            }else {
                location['value'] = '';
            }  
            if (this.location_name) {
                location['location_name'] = this.location_name;
            } else {
                location['location_name'] = '';
            }          
            if (this.type) {
                location['type'] = this.type;
            } else {
                location['type'] = '';
            }
            if (this.broader_name_1) {
                location['broader_name_1'] = this.broader_name_1;
            } else {
                location['broader_name_1'] = '';
            }
            if (this.broader_type_1) {
                location['broader_type_1'] = this.broader_type_1;
            } else {
                location['broader_type_1'] = '';
            }
            if (this.broader_name_2) {
                location['broader_name_2'] = this.broader_name_2;
            } else {
                location['broader_name_2'] = '';
            }
            if (this.broader_type_2) {
                location['broader_type_2'] = this.broader_type_2;
            } else {
                location['broader_type_2'] = '';
            }

            if (this.preferredName) {
                location['location_name'] = this.preferredName;
            }/* else {
             location['corrected_vernacular'] = this.vernacular;
             }*/
            if (this.tgnId) {
                location['tgnId'] = this.tgnId;
            } else {
                location['tgnId'] = '';
            }
            /* if (this.preferredTGN) {
             location['preferredTGN'] = this.preferredTGN;
             } else {
             location['preferredTGN'] = '';
             }*/

            if (this.coords) {
                location['coords'] = this.coords;
            } else {
                location['coords'] = '';
            }

            if (this.other_name) {
                location['other_name'] = this.other_name;
            } else {
                location['other_name'] = '';
            }

            if (this.geoId) {
                location['geoId'] = this.geoId;
            } else {
                location['geoId'] = '';
            }

            if (this.uncertain) {
                location['uncertain'] = this.uncertain;
            } else {
                location['uncertain'] = '';
            }

////////////////////////////////////////////////////////////////////////////////
            // SAME AS REPLACED BY
            var same = new Object();
            if (this.sameAs) {
                var same_as = this.sameAs;
                var sames = new Object();
                $.each(this.sameAs, function (cnt) {
                    sames['same_' + cnt] = JSON.parse(same_as[cnt].replace(/'/g, '"'));
                    same['sames'] = sames;
                });
            }
            location['sameAs'] = same;

            if (this.replacedBy) {
                location['replacedBy'] = JSON.parse((this.replacedBy).replace(/'/g, '"'));
            } else {
                location['replacedBy'] = new Object();
            }
            
////////////////////////////////////////////////////////////////////////////////
            var usagios = new Object();
            var row = this;
            var oo = 0;
            
            $.each(this.usage, function (recordId) {
                usagios['usage_' + oo] = create_usages(this, row, recordId,'locations');
                oo++;
                
            });

            location['usages'] = usagios;
            locations['location_' + i] = location;
            i++;
            
        }

    });

    var locations_res = new Object();
    locations_res['locations'] = locations;
    find_other_usages(locations_res,locations_doc,'locations');
    

    if (beautify === 'beautify') {
        locations_xml = formatXml(json2xml(locations_res));
    } else {
        locations_xml = json2xml(locations_res);
    }

    locations_xml = locations_xml.replace(/<location_(\d+)>/g, '<location index="$1">');
    locations_xml = locations_xml.replace(/<\/location_(\d+)>/g, "</location>");

    locations_xml = locations_xml.replace(/<occurence_(\d+)>/g, '<occurence index="$1">');
    locations_xml = locations_xml.replace(/<\/occurence_(\d+)>/g, "</occurence>");
    
    locations_xml = locations_xml.replace(/<usage_(\d+)>/g, '<usage index="$1">');
    locations_xml = locations_xml.replace(/<\/usage_(\d+)>/g, "</usage>");


    return locations_xml;

}
;

///////////////////////EXPORT ZIP//////////////////////////


var zip = new JSZip();

$('#zip_export').click(function () {
    
//////////collect template types and titles ////////////////////////////////////    
    templatesDB_remote.allDocs({
        include_docs: true,
        descending: false
    }).then(function (result) {
        
        $.each(result.rows, function () {
            template_types[this.doc['title']] = this.doc['_id'];
        });
    });
    
//////////collect template types and titles ////////////////////////////////////    

    var filename = $('#unique_filename').text();

    //Record Data
    
    $("#exporting_modal").find('#exported_text').text('');
    $("#exporting_modal").find('#progress_number').attr('style', "width: 0%");
    $("#exporting_modal").modal('show');
    
   //$('#exporting_modal').on('shown.bs.modal', function () {

        zip.file(filename.replace(/[`()&_|+\-=?;:!'",.<>\{\}\[\]\\\/]/gi, '_') + ".xml", create_xml_file());

        //////////////////////////////////////////////
        var startTime = new Date();
        getAllInstancesAndZip(zip, filename, startTime);
        
     //  $("#exporting_modal").modal('hide');
     //   $(this).off('shown.bs.modal');
    //});

});

////////////////////////////////////////////////////////////////////////////////

function export_instances_XML() {
    var startTime = new Date();
    getAllInstancesTransformAndImport(startTime);
}


function getAllInstancesTransformAndImport(startTime) {
    var instances = [];
    getInstancesByTypeTransformAndImport(startTime, "ships", instances);

}

function getInstancesByTypeTransformAndImport(startTime, type, instances) {
    var localAndRemoteDBs = getInstanceDBsFromType(type);
    var remoteDB = localAndRemoteDBs[1];

    remoteDB.allDocs({
        include_docs: true,
        descending: false
    }).then(function (result) {
        var insts = {};        
        $.each(result.rows, function () {
            insts = appendJSONObject(insts, this.doc.instances);
          
        });
//        console.log(insts);

        var fileJSON = {
            "_id": type,
            "lastModified": new Date().toJSON(),
            "instances": insts
        };
        
       
        if (type === "ships") {
            instances['Ships'] = ship_instances_XML(fileJSON);
            getInstancesByTypeTransformAndImport(startTime, "organizations", instances);
        } else if (type === "organizations") {
            instances['Organizations'] = organization_instances_XML(fileJSON);
            getInstancesByTypeTransformAndImport(startTime, "locations", instances);
        } else if (type === "locations") {
            instances['Locations'] = location_instances_XML(fileJSON);
            getInstancesByTypeTransformAndImport(startTime, "persons", instances);
        } else if (type === "persons") {
            instances['Persons'] = person_instances_XML(fileJSON);                         
            var timeToCreateXML = new Date() - startTime;
            console.log("Took " + timeToCreateXML / 1000 + " secs to create Instances XML!");
    
            transformAndImportToTripleStore(timeToCreateXML, instances, "Ships");
        }

    }).catch(function (err) {
        console.log(err);
    });
}

//Zip helper functions

function getAllInstancesAndZip(zip, filename, startTime) {

    getInstancesByTypeAndZip(zip, filename, startTime, "ships");
}



function getInstancesByTypeAndZip(zip, filename, startTime, type) {
    var localAndRemoteDBs = getInstanceDBsFromType(type);
    var remoteDB = localAndRemoteDBs[1];
    
    publicVocabsDB_remote.allDocs({
        include_docs: true,
        descending: false
    }).then(function (vocs_result) {

        remoteDB.allDocs({
            include_docs: true,
            descending: false
        }).then(function (result) {
            var insts = {};

            $.each(result.rows, function () {
                insts = appendJSONObject(insts, this.doc.instances);
            });
//        console.log(insts);

            var fileJSON = {
                "_id": type,
                "lastModified": new Date().toJSON(),
                "instances": insts
            };



            if (type === "ships") {
                $("#exporting_modal").find('#exported_text').html('<b>Ships</b> included in zip!');
                zip.file("Ships.xml", ship_instances_XML(fileJSON, 'beautify'));
                getInstancesByTypeAndZip(zip, filename, startTime, "organizations");
                $("#exporting_modal").find('#exported_text').html('<b>Organizations</b> included in zip!');
                $("#exporting_modal").find('#progress_number').attr('style', "width: 25%");
            } else if (type === "organizations") {
                zip.file("Organizations.xml", organization_instances_XML(fileJSON, 'beautify'));
                getInstancesByTypeAndZip(zip, filename, startTime, "locations");
                $("#exporting_modal").find('#exported_text').html('<b>Locations</b> included in zip!');
                $("#exporting_modal").find('#progress_number').attr('style', "width: 50%");
            } else if (type === "locations") {
                zip.file("Locations.xml", location_instances_XML(fileJSON, 'beautify'));
                getInstancesByTypeAndZip(zip, filename, startTime, "persons");
                $("#exporting_modal").find('#exported_text').html('<b>Persons</b> included in zip!');
                $("#exporting_modal").find('#progress_number').attr('style', "width: 75%");
            } else if (type === "persons") {
                //console.log(fileJSON)
                zip.file("Persons.xml", person_instances_XML(fileJSON, 'beautify'));

                zip.file("Vocabularies.xml", vocabularies_XML(vocs_result, "beautify"));

                zip.generateAsync({type: "blob"}).then(function (content) {
                   
                   
                //    $(".modal-backdrop").hide();
                    saveAs(content, filename + ".zip");
                    // $("#exporting_modal").hide();
                });
                
                var timeToCreateXML = new Date() - startTime;
                console.log("Took " + timeToCreateXML / 1000 + " secs to include instances in zip!");
                 $("#exporting_modal").find('#progress_number').attr('style', "width: 100%");
                $("#exporting_modal").modal('hide');
            }


        }).catch(function (err) {
            console.log(err);
        });
    });
       
}