# circle-of-search
A search extension to find people who have done similar searches



- Install Elastic Search
- Configure SSL
-- https://github.com/floragunncom/search-guard-ssl-docs/blob/master/quickstart.md
- Configure ` vi config/elasticsearch.yml `
-- `` http.cors.enabled : true
   http.cors.allow-origin : 'chrome-extension://cfihblobdofekjkelcfjminmmhdgmlhh'
   #http.cors.allow-origin : '/chrome-extension:\/\/(a-zA-Z0-9)?'
   http.cors.allow-credentials : true
 ``

- Optional Elastic Search Browsers plugin `` - Optional Elastic Search HEAD plugin ``