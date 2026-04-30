.PHONY: install dev build start lint typecheck docker-build docker-run docker-dev

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

typecheck:
	npm run typecheck

docker-build:
	docker build -t cinemood:latest .

docker-run:
	docker compose up --build

docker-dev:
	docker compose -f compose.dev.yml up
