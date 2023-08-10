install:
	npm ci
	sudo npm link

reinstall:
	npm link

lint:
	npx eslint .

test:
	npx jest

test-full:
	npx jest --watchAll

test-coverage:
	npx jest --coverage
