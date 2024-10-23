{pkgs}: {
  deps = [
    pkgs.inotify-tools
    pkgs.watchman
    pkgs.postgresql
    pkgs.openssl
  ];
}
