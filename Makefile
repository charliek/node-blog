# Simple make file to package up a docker instance. To use just you can just type:
#   make build
# Or if you want to name your container you can instead type something like
#   make build image="charliek/node-blog"
#
# That will create a new directory docker-build, copy the working files there, and
# then kick off a docker build.

.PHONY : build all

temp_dir = docker-build
image = node-blog

build: clean
	mkdir $(temp_dir)
	cp -r client server .bowerrc .jshintrc .jshintrc-server bower.json gulpfile.js package.json $(temp_dir)/
	docker build -t $(image) .
	rm -rf $(temp_dir)

clean:
	rm -rf $(temp_dir)