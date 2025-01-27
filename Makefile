DOCKER_COMPOSE = ./docker/docker-compose.yml
PROJECT_NAME = sql-ai

up:
	npm run compile
	docker compose -f $(DOCKER_COMPOSE) -p $(PROJECT_NAME) up -d

down:
	docker compose -f $(DOCKER_COMPOSE) -p $(PROJECT_NAME) down

db-term:
	docker compose -f $(DOCKER_COMPOSE) -p $(PROJECT_NAME) exec db mysql -u user -p
