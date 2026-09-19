const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function configurePassport(passport, prisma) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return done(null, false, { message: 'No user found with that email.' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = { configurePassport };
