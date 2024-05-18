{
  description = "Example flake for running a local app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let 
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        apps.default = {
          type = "app";
          program = let
            # Define the app script
            app = pkgs.writeShellScriptBin "myapp" ''
              echo "Starting app on localhost:8000"
              ${pkgs.python3}/bin/python -m http.server 8000
            '';
          in "${app}/bin/myapp";
        };
      }
    );
}
