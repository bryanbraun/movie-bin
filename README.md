Movie Bin
=========

This is a small front-end app that takes a json dump of movies from the Rotten Tomatos API and renders it on the page. It sits on top of a bare-bones Django site.

Setup
-----

**0. Make sure you have [git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [python](https://www.python.org/downloads/), and [pip](https://pip.pypa.io/en/latest/installing.html) installed.**

**1. Download the repo with git:**
```bash
git clone git@github.com:bryanbraun/movie-bin.git
```
**2. Install all dependencies.**
```bash
cd movie-bin
pip install -r requirements.txt
```
**3. Run the server:**
```bash
python manage.py runserver
# Starting development server at http://127.0.0.1:8000/
```
