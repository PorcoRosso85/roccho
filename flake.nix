{
  description = "My Neovim flake";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux"; # Or whatever system you are on
      pkgs = import nixpkgs { inherit system; };

      # database = import ./database.nix { inherit pkgs; };
    in
    {
      packages.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.neovim
          pkgs.zsh
          pkgs.zsh-powerlevel10k
          pkgs.git
          pkgs.gh
          pkgs.curl
          pkgs.wget
          pkgs.eza
          pkgs.fd
          pkgs.bat
          pkgs.lazygit
          pkgs.nil
          pkgs.nixpkgs-fmt

          pkgs.docker
          pkgs.lazydocker
          # pkgs.containerd?
          # pkgs.act

        ];

        shellHook = ''
          echo "Hello, world! Shell hook ran by nix flakes."

        '';

      };
    };
}
