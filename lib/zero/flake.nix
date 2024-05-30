{
  description = "Hello World HTTP server";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  # inputs.parent.url = "github:PorcoRosso85/nix_test";
  # inputs.parent.url = "../../";

  outputs =
    { self
    , nixpkgs
    , flake-utils
      # , parent 
    }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      # parentOutPuts = parent.outputs;
    in
    {
      # nix develop
      devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.zig
        ];
        shellHook = ''
          echo 'no runtime'
          
          zig --version
        '';
      };

      # nix run
      packages = {
        cowsay = pkgs.cowsay;
      };

      apps = {
        # .#hello
        hello = flake-utils.lib.mkApp {
          drv = pkgs.hello;
        };
        hello2 = flake-utils.lib.mkApp {
          drv = pkgs.writeShellScriptBin "hello_from_shell" ''
            echo "Hello from shell!" 
          '';
        };
        test = flake-utils.lib.mkApp {
          drv = pkgs.writeShellScriptBin "test" ''
            cd ./database
            pnpm vitest .
            cd ..
          '';
        };
      };

    }
    );
}


