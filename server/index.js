var render = require('./lib/render');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var request = require('co-request');
var serve = require('koa-static');
var nconf = require('nconf');
var app = koa();

// config
nconf.env().argv().defaults({
  blog_prefix: 'http://localhost:5678'
});

// database
var posts = [];

// middleware
app.use(logger());
app.use(serve(__dirname + '/../public'));

// route middleware
app.use(route.get('/', list));
app.use(route.get('/post/new', add));
app.use(route.get('/post/:id', show));
app.use(route.post('/post', create));

function blogUrl(path) {
  return nconf.get('blog_prefix') + path;
}

function *blogContent(path) {
  var resp = yield request(blogUrl(path));
  if (resp.statusCode == 200) {
    resp.json = JSON.parse(resp.body);
  }
  // TODO add error handling
  return resp;
}

/**
 * Post listing.
 */
function *list() {
  var resp = yield blogContent('/post');
  this.body = yield render('list', { posts: resp.json });
}

/**
 * Show creation form.
 */
function *add() {
  this.body = yield render('new');
}

/**
 * Show post :id.
 */
function *show(id) {
  // TODO validate id
  var resp = yield blogContent('/post/'+id);
  if (resp.statusCode == 404) {
    this.throw(404, 'invalid post id');
  }
  this.body = yield render('show', { post: resp.json });
}

/**
 * Create a post.
 */
function *create() {
  var post = yield parse(this);
  var id = posts.push(post) - 1;
  post.created_at = new Date();
  post.id = id;
  this.redirect('/');
}

// listen
app.listen(3000);
console.log('listening on port 3000');
