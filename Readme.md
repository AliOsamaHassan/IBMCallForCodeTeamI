##Verifying Request Flow##

This flow is responsible for verifying the received requests from the chatbot 
(Victims & bystanders).

1st Sub flow:

After victims or/and bystanders request help through the chatbot, these requests
are stored in a Cloudant database. This flow imports requests from the database 
periodically (1 minute) and filter them. The filtration process is threshold-based. 
If the chatbot receives more than 10 requests with the same disaster from the 
same city, one request is sent to the blockchain network to fire a transaction 
so NGOs can help them with.

2nd Sub flow:

After Sending request to the blockchain network, the flow transfer the verified
requests from the Chatbot Database to another database "Verified Requests Database"
to avoid repetition.

##Twilio SMS Flow##

This Flow simply enables vicitims & bystanders to report disasters by communicating 
with our chatbot via SMS. Our system uses Twilio services to enable anyone to 
send SOS requests to our web-based service without an internet connection.
