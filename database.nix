# postgres.nix
{ pkgs, ... }:
pkgs.writeShellScriptBin "hello" ''
  echo hello from database.nix
''
