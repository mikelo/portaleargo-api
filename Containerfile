FROM registry.fedoraproject.org/f42/nodejs22
RUN npm install
ENTRYPOINT [ "npm run dev" ]