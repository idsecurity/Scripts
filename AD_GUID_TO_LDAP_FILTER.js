#!%JAVA_HOME%/bin/jjs

/*
 * Copyright (C) 2016 almu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

if (arguments.length == 0) {
    printUsage();
}

var inputString = arguments[0];
var guidLdapFilter = [];

if (inputString.length !== 32 && inputString.length !== 38) {
    print("Not a GUID or driver association: " + inputString);
    print("Argument length: " + inputString.length + ", should be 32 or 38");
    printUsage();
}

function printUsage() {
    print("Usage: jjs AD_GUID_TO_LDAP_FILTER.js -- <AD driver association>");
    print("Usage: jjs AD_GUID_TO_LDAP_FILTER.js -- <{GUID}>");
    print("\n");
    print("The GUID {cdcb88b6-c676-41dd-bdc0-99087c485048} will result in: (objectGUID=\\b6\\88\\cb\\cd\\76\\c6\\dd\\41\\bd\\c0\\99\\08\\7c\\48\\50\\48)");
    print("\n");
    print("The association b688cbcd76c6dd41bdc099087c485048 will result in: (objectGUID=\\b6\\88\\cb\\cd\\76\\c6\\dd\\41\\bd\\c0\\99\\08\\7c\\48\\50\\48)");
    exit(1);
}


if (inputString.length === 32) {
    print("Converting association");
    associationToLdapFilter();
} else {
    print("Converting GUID");
    adguid2association();
}


function associationToLdapFilter() {
    var split = inputString.split('');

    for (var i=0; i<split.length; i++) {
        if (i === 0) {
            guidLdapFilter.push("\\");
        }
        guidLdapFilter.push(split[i]);
        if (i % 2 === 1 && i !== 31) {
            guidLdapFilter.push("\\");
        }   
    }    
}

function adguid2association() {
    
    var split = inputString.split('-');
    
    //Delete the first char: {
    split[0] = split[0].slice(1);
    
    //Delete the last char }
    split[4] = split[4].slice(0, -1);
    
    //Change endianness of the first three elements
    split[0] = reverse(reverseOrderAtSplit(split[0], 2));
    split[1] = reverse(reverseOrderAtSplit(split[1], 2));
    split[2] = reverse(reverseOrderAtSplit(split[2], 2));
    
    
    inputString = split.join('');
    //Now we have the same format as the association value
    associationToLdapFilter();
}

function reverse(s) {
    return s.split('').reverse().join('');
}

function reverseOrderAtSplit(s, length) {
    var chunk = [];
    for (var i = 0; i < s.length; i += length) {
        chunk.push(s.substring(i, i + length));
    }
    for (var i = 0; i < chunk.length; i++) {
        chunk[i] = reverse(chunk[i]);
    }
    return chunk.join('');
}

print("(objectGUID=" + guidLdapFilter.join('') + ")");
exit(0);

//GUID endianness: https://blogs.msdn.microsoft.com/openspecification/2013/10/08/guids-and-endianness-endi-an-ne-ssinguid-or-idne-na-en-ssinguid/