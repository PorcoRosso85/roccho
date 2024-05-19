{
  description = "Example flake for running a local app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        defaultPackage = pkgs.mkShell {
          buildInputs = [ pkgs.python3 pkgs.python3Packages.flask ];
          shellHook = ''
            echo "Hello, {input} + world"
            export FLASK_APP=app.py
            flask run
          '';
        };
      }
    );
}
