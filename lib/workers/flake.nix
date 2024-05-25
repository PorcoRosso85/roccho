{
  description = "Hello World HTTP server";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          develop = { pkgs }:
            pkgs.mkShell
              {
                buildInputs = [ pkgs.nodejs pkgs.nodePackages.pnpm ];
              };

          run = { pkgs }:
            pkgs.writeShellScriptBin "run" ''
              echo "nix run testing"
            '';

          hello = { pkgs }:
            pkgs.hello;

        in
        {
          devShell = develop { inherit pkgs; };
          # defaultPackage = run { inherit pkgs; };

          packages.x86_64-linux = {
            # hello = pkgs.hello;
            hello = hello { inherit pkgs; };
            cowsay = pkgs.cowsay;
          };

          apps.x86_64-linux = {
            hi = { pkgs, }:
              pkgs.writeShellScriptBin "hello" ''
                echo "Hello World"
              '';
            hello = {
              type = "app";
              program = "${self.packages.x86_64-linux.hello}/bin/hello";
            };

            cowsay = {
              type = "app";
              program = "${self.packages.x86_64-linux.cowsay}/bin/cowsay";
            };
          };
        }
      );
}
