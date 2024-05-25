{
  description = "Hello World HTTP server";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [ pkgs.nodejs pkgs.nodePackages.pnpm ];
        };
        packages = {
          cowsay = pkgs.cowsay;
        };

        apps = {
          hello = flake-utils.lib.mkApp {
            drv = pkgs.hello;
          };
          cowsay = flake-utils.lib.mkApp {
            drv = self.packages.${system}.cowsay;
          };

          hello2 = flake-utils.lib.mkApp {
            drv = pkgs.writeShellScriptBin "hello_from_shell" ''
              echo "Hello from shell!" 
            '';
          };
        };
      }
    );
}


