FROM stsiwo/python.3.8-pck:0.1 as dep-install

### python venv with dockerfile
# caveats:
#  1. can't use 'RUN . env/bin/activate -> RUN (something with pip)'
#    - this is because each RUN use separate process. so there is no effect in second RUN with activate
#    - solution:
#      - append '. env/bin/activate' fore every RUN command where need venv
#      - or don't use venv at all
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
# remove .build-deps (all pcks installed at base image)
RUN apk del .build-deps

FROM dep-install as testing

WORKDIR /app
COPY entrypoint.testing.sh ./
COPY api1-testing.db ./
RUN ["chmod", "+x", "./entrypoint.testing.sh"]
ENTRYPOINT ["./entrypoint.testing.sh"]
#CMD tail -f /dev/null 

FROM dep-install as development

WORKDIR /app
COPY entrypoint.development.sh ./
COPY api1-development.db ./
RUN ["chmod", "+x", "./entrypoint.development.sh"]
ENTRYPOINT ["./entrypoint.development.sh"]

FROM dep-install as staging

WORKDIR /app
COPY ./ ./ 
RUN ["chmod", "+x", "./entrypoint.staging.sh"]
ENTRYPOINT ["./entrypoint.staging.sh"]

FROM dep-install as production

WORKDIR /app
COPY ./ ./ 
RUN ["chmod", "+x", "./entrypoint.production.sh"]
ENTRYPOINT ["./entrypoint.production.sh"]
