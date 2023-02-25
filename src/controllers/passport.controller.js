export async function fail(req, res) {
  console.log('Failed login');
  res.redirect('error', { error: 'Failed login' });
}

export async function signUp(req, res) {
  res.status(201).redirect('/products');
}

export async function login(req, res) {
  /*     req.session.logged = true; 
    req.session.user = req.user; */
  res.status(200).redirect('/products');
}

export async function logout(req, res, next) {
  try {
    await req.logout(async (err) => {
      if (err) return next(err);

      await req.session.destroy(() =>
        res.status(200).json({ redirectURL: '/' })
      );
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}