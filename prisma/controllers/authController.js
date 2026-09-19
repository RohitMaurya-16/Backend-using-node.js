const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', error: null });
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await req.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'Username or email already in use.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await req.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).render('auth/register', {
          title: 'Register',
          error: 'Unable to log you in after registration.',
        });
      }
      req.flash('success', 'Registration successful.');
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('auth/register', {
      title: 'Register',
      error: 'Unable to register user right now.',
    });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', error: req.flash('error')[0] || null });
};

exports.postLogin = passport.authenticate('local', {
  failureRedirect: '/auth/login',
  failureFlash: true,
  successRedirect: '/',
});

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/auth/login');
  });
};
