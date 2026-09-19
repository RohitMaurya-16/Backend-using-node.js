const express = require('express');
const path = require('node:path');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const helmet = require('helmet');
const methodOverride = require('method-override');
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

const { configurePassport } = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    name: 'prisma_session',
    secret: process.env.SESSION_SECRET || 'debug-secret',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
      logger: console,
      tableName: 'Session',
      modelKey: 'id',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 8,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport, prisma);

app.use((req, res, next) => {
  req.prisma = prisma;
  res.locals.currentUser = req.user || null;
  res.locals.successFlash = req.flash('success');
  res.locals.errorFlash = req.flash('error');
  next();
});

app.use('/', dashboardRoutes);
app.use('/auth', authRoutes);
app.use('/folders', folderRoutes);
app.use('/files', fileRoutes);

app.use((req, res) => {
  res.status(404).render('notFound', { title: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`Prisma file manager running on http://localhost:${PORT}`);
});
