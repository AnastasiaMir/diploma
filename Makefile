start-backend:
	cd backend && npm run start

start-frontend:
	cd frontend && npm run build && npm run dev
	
install:
	cd backend && npm install
	cd frontend && npm install

build:
	rm -rf frontend/build
	cd frontend/dist npm run build

lint:
	npm run lint

lint-fix:
	npm run lint-fix
	