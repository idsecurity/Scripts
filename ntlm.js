importPackage(Packages.sun.security.provider);
importPackage(Packages.javax.xml.bind);
importPackage(Packages.com.sun.xml.internal.bind);
importPackage(Packages.org.apache.commons.codec.binary);


/*
* Convert a password to a NTLMv1 hash
* NTLM hash is the password converted to UTF-16LE and then a MD4 hash is performed on the UTF-16LE password
* 
* @author Aleksandar Mujadin
* @since 2014-09-29
*/
function getNTLMHash(password) {

	var md4 = MD4.getInstance();//Internal - yes we shouldn't use internal classes... But we don't have write our own implementation
	
	var javaPassword = new java.lang.String(password);//Create a Java string from the JavaScript string
	
	var result = "";
	
	try {
	
			md4['update(byte[])'](javaPassword.getBytes("UTF-16LE"));
			
			var digest = md4.digest();
			
			result = new java.lang.String(Hex.encodeHex(digest));
			result.toUpperCase();
		
		} catch (e) {
			
			result = "ERROR: " + e;
		
		}


	return result;

}

/*
* Get number of days since 1970-01-01
*/
function noOfDaysSinceEpoch() {
	var oneDay = 86400;//Seconds, not exact because of leap seconds but who cares
	
	return Math.round((Date.now() / 1000) / oneDay);

}

/* Example policy rule on how to use the script with NetIQ Identity Manager
<rule notrace="true">
	<description>Convert password to NTLM hash and set sambaNTPassword</description>
	<comment name="author" xml:space="preserve">Aleksandar Mujadin</comment>
	<comment name="version" xml:space="preserve">1.0</comment>
	<comment name="lastchanged" xml:space="preserve">2014-09-30</comment>
	<conditions>
		<and>
			<if-class-name mode="case" op="equal">User</if-class-name>
			<if-op-attr name="nspmDistributionPassword" op="available"/>
		</and>
	</conditions>
	<actions>
		<do-set-local-variable name="password" scope="policy">
			<arg-string>
				<token-op-attr name="nspmDistributionPassword"/>
			</arg-string>
		</do-set-local-variable>
		<do-set-dest-attr-value name="sambaNTPassword">
			<arg-value type="string">
				<token-xpath expression="es:getNTLMHash($password)"/>
			</arg-value>
		</do-set-dest-attr-value>
		<do-set-dest-attr-value name="sambaPwdLastSet">
			<arg-value type="string">
				<token-time format="!CTIME" tz="UTC"/>
			</arg-value>
		</do-set-dest-attr-value>
		<do-set-dest-attr-value name="shadowLastChange">
			<arg-value type="string">
				<token-xpath expression="es:noOfDaysSinceEpoch()"/>
			</arg-value>
		</do-set-dest-attr-value>
	</actions>
</rule>
*/

