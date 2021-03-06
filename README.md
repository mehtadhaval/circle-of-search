# circle-of-search
A search extension to find people who have done similar searches


- Install Elastic Search
- Configure SSL
- https://github.com/floragunncom/search-guard-ssl-docs/blob/master/quickstart.md
- Configure ` vi config/elasticsearch.yml `



>     http.cors.enabled: true
>     http.cors.allow-origin: "*"
>     http.cors.allow-credentials: true
>     
>     searchguard.ssl.transport.keystore_filepath: node-0-keystore.jks
>     searchguard.ssl.transport.keystore_password: changeit
>     searchguard.ssl.transport.truststore_filepath: truststore.jks
>     searchguard.ssl.transport.truststore_password: changeit
>     searchguard.ssl.transport.enforce_hostname_verification: false
>     
>     searchguard.ssl.http.enabled: true
>     searchguard.ssl.http.keystore_filepath: node-0-keystore.jks
>     searchguard.ssl.http.keystore_password: changeit
>     searchguard.ssl.http.truststore_filepath: truststore.jks
>     searchguard.ssl.http.truststore_password: changeit
>     searchguard.ssl.transport.http.enforce_clientauth: false
>     
>     script.inline: true

- Create index and add field mappings to Elasticsearch

> `  curl -X PUT https://localhost:9200/cos --insecure  `
> `  curl -X PUT https://localhost:9200/cos/search_term/_mapping -d  @mappings/search_term.json --insecure  `
> `  curl -X PUT https://localhost:9200/cos/result_visited/_mapping -d @mappings/result_visited.json --insecure  `

- Optional Elastic Search Browsers plugin `` https://github.com/mobz/elasticsearch-head ``
